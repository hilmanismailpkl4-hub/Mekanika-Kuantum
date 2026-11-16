"""
Data models and dataset parser for Quantum Lab Backend.
"""

from dataclasses import dataclass, asdict
from typing import List, Optional, Dict, Any
import json
from pathlib import Path

DATA_PATH = Path(__file__).parent / "data" / "kuantum.json"


@dataclass
class BilingualText:
    id: str
    en: str


@dataclass
class Chapter:
    id: int
    code: str
    era: str
    title_id: str
    title_en: str
    concept: str
    formula: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "code": self.code,
            "era": self.era,
            "title": {"id": self.title_id, "en": self.title_en},
            "concept": self.concept,
            "formula": self.formula,
        }


@dataclass
class QuizOption:
    id: str
    en: str


@dataclass
class QuizQuestion:
    id: str
    chapter_id: int
    prompt: BilingualText
    options: List[QuizOption]
    answer: int
    formula: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "chapter_id": self.chapter_id,
            "prompt": asdict(self.prompt),
            "formula": self.formula,
            "options": [asdict(opt) for opt in self.options],
            "answer": self.answer,
        }


@dataclass
class JournalEntry:
    id: str
    chapter_id: int
    title: BilingualText
    note: BilingualText
    formula: Optional[str]
    discovered_at: str

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "chapter_id": self.chapter_id,
            "title": asdict(self.title),
            "note": asdict(self.note),
            "formula": self.formula,
            "discovered_at": self.discovered_at,
        }


@dataclass
class UserProgress:
    current_chapter: int = 1
    unlocked_chapters: List[int] = None
    completed_chapters: List[int] = None
    xp: int = 0
    badges: List[str] = None

    def __post_init__(self):
        if self.unlocked_chapters is None:
            self.unlocked_chapters = [1]
        if self.completed_chapters is None:
            self.completed_chapters = []
        if self.badges is None:
            self.badges = []

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class DatasetLoader:
    """Loads and queries curriculum metadata from kuantum.json."""

    def __init__(self, data_file: Path = DATA_PATH):
        self.data_file = data_file
        self.raw_data = self._load()
        self.chapters = self._parse_chapters()

    def _load(self) -> Dict[str, Any]:
        if not self.data_file.exists():
            return {}
        with open(self.data_file, "r", encoding="utf-8") as f:
            return json.load(f)

    def _parse_chapters(self) -> List[Chapter]:
        formulas = {
            1: "E = nhf",
            2: "K_{max} = hf - \\Phi",
            3: "L = n\\hbar",
            4: "\\lambda = \\frac{h}{p}",
            5: "i\\hbar\\frac{\\partial \\psi}{\\partial t} = \\hat{H}\\psi",
            6: "\\Delta x\\,\\Delta p \\ge \\frac{\\hbar}{2}",
            7: "E_n = \\frac{n^2\\pi^2\\hbar^2}{2mL^2}",
            8: "T \\approx e^{-2\\kappa L}",
            9: "E_g = E_C - E_V",
            10: "n\\,p = n_i^2",
            11: "I = I_s\\left(e^{qV/kT} - 1\\right)",
            12: "I_D = \\tfrac{1}{2}\\mu C_{ox}\\tfrac{W}{L}(V_{GS}-V_{th})^2",
            13: "CD = k_1\\frac{\\lambda}{NA}",
        }
        chapters_data = self.raw_data.get("chapters_blueprint", [])
        chapters = []
        for c in chapters_data:
            cid = c.get("id")
            chapters.append(
                Chapter(
                    id=cid,
                    code=c.get("code", f"CH-{cid:02d}"),
                    era=c.get("era", "quantum_birth"),
                    title_id=c.get("title_id", ""),
                    title_en=c.get("title_en", ""),
                    concept=c.get("concept", ""),
                    formula=formulas.get(cid, ""),
                )
            )
        return chapters

    def get_all_chapters(self) -> List[Dict[str, Any]]:
        return [ch.to_dict() for ch in self.chapters]

    def get_chapter(self, chapter_id: int) -> Optional[Dict[str, Any]]:
        for ch in self.chapters:
            if ch.id == chapter_id:
                return ch.to_dict()
        return None
