"""
Quantum Lab API Server
Consolidated lightweight backend for Quantum Lab physics simulation curriculum.
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import re
import sys
from typing import Any
from pathlib import Path

from models import DatasetLoader, UserProgress

PORT = 8000
dataset = DatasetLoader()
current_progress = UserProgress()

# 13-Chapter Curriculum Quiz Bank (5 questions per chapter)
CHAPTER_FORMULAS = {
    1: "E = n h f",
    2: "K_{max} = h f - \\Phi",
    3: "L = n\\hbar, \\quad E_n = -13.6/n^2 \\text{ eV}",
    4: "\\lambda = \\frac{h}{p}",
    5: "i\\hbar\\frac{\\partial \\Psi}{\\partial t} = \\hat{H}\\Psi",
    6: "T \\approx e^{-2\\kappa L}",
    7: "E_g = E_C - E_V",
    8: "n \\cdot p = n_i^2",
    9: "I = I_s\\left(e^{qV/k_BT} - 1\\right)",
    10: "I_D = \\frac{1}{2}\\mu C_{ox}\\frac{W}{L}(V_{GS}-V_{th})^2",
    11: "CD = k_1\\frac{\\lambda}{NA}",
    12: "P_{dyn} = \\alpha C_L V_{DD}^2 f",
    13: "\\tau \\propto \\frac{C_L V_{DD}}{I_{on}}",
}


class QuantumLabHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def _send_json(self, status: int, data: Any):
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False, indent=2).encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        path = self.path.split("?")[0].rstrip("/")

        if path in ("", "/api", "/api/health"):
            self._send_json(200, {
                "status": "ok",
                "app": "Quantum Lab Backend",
                "version": "1.0.0",
                "curriculum_chapters": len(dataset.chapters),
                "supported_languages": ["id", "en"],
            })
            return

        if path == "/api/chapters":
            self._send_json(200, {
                "total": len(dataset.chapters),
                "chapters": dataset.get_all_chapters(),
            })
            return

        chapter_match = re.match(r"^/api/chapters/(\d+)$", path)
        if chapter_match:
            cid = int(chapter_match.group(1))
            ch = dataset.get_chapter(cid)
            if ch:
                ch["formula"] = CHAPTER_FORMULAS.get(cid, "E = hf")
                self._send_json(200, ch)
            else:
                self._send_json(404, {"error": f"Chapter {cid} not found"})
            return

        quiz_match = re.match(r"^/api/quiz/(\d+)$", path)
        if quiz_match or path == "/api/quiz":
            cid = int(quiz_match.group(1)) if quiz_match else 1
            self._send_json(200, {
                "chapter_id": cid,
                "formula": CHAPTER_FORMULAS.get(cid, "E = hf"),
                "total_questions": 5,
                "status": "ready",
            })
            return

        if path == "/api/progress":
            self._send_json(200, current_progress.to_dict())
            return

        if path == "/api/dataset":
            self._send_json(200, dataset.raw_data)
            return

        self._send_json(404, {"error": "Endpoint not found", "path": path})

    def do_POST(self):
        global current_progress
        path = self.path.split("?")[0].rstrip("/")

        if path == "/api/progress":
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length > 0:
                body = self.rfile.read(content_length).decode("utf-8")
                try:
                    payload = json.loads(body)
                    if "current_chapter" in payload:
                        current_progress.current_chapter = int(payload["current_chapter"])
                    if "unlocked_chapters" in payload:
                        current_progress.unlocked_chapters = list(payload["unlocked_chapters"])
                    if "completed_chapters" in payload:
                        current_progress.completed_chapters = list(payload["completed_chapters"])
                    if "xp" in payload:
                        current_progress.xp = int(payload["xp"])
                    if "badges" in payload:
                        current_progress.badges = list(payload["badges"])

                    self._send_json(200, {
                        "status": "updated",
                        "progress": current_progress.to_dict(),
                    })
                    return
                except Exception as e:
                    self._send_json(400, {"error": f"Invalid JSON payload: {str(e)}"})
                    return

        self._send_json(404, {"error": "Endpoint not found"})


def run_server(port: int = PORT):
    server_address = ("", port)
    httpd = HTTPServer(server_address, QuantumLabHandler)
    print(f"[*] Quantum Lab Backend running on http://localhost:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Shutting down server.")
        httpd.server_close()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    run_server(port)
