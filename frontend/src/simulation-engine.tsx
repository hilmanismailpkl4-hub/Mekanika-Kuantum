import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Play, Pause, RotateCcw, HelpCircle, Cpu, Zap, Sliders, ChevronDown, ChevronUp, Sparkles, AlertCircle } from "lucide-react";
import { Tex, PixelButton, PixelPanel, PixelTag, cn } from "./ui-components";
import { useLocalized, useGameStore, useT } from "./app-state";
import type { SimulationConfig, LayeredExplanation, SideQuest } from "./curriculum";
import { sound } from "./sound";

interface SimulationProps {
    config: SimulationConfig;
    askWhy: LayeredExplanation;
    sideQuest?: SideQuest;
    chapterCode: string;
}

export function SimulationCanvas({ config, askWhy, sideQuest, chapterCode }: SimulationProps) {
    const loc = useLocalized();
    const t = useT("chapter");
    const soundEnabled = useGameStore((s) => s.soundEnabled);

    // Simulation parameter states
    const [params, setParams] = useState<Record<string, number>>(() => {
        const initial: Record<string, number> = {};
        config.params.forEach((p) => {
            initial[p.id] = p.defaultValue;
        });
        return initial;
    });

    const [sign, setSign] = useState<number>(config.defaultSign ?? 1);
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const [isSandbox, setIsSandbox] = useState<boolean>(false);
    const [activeWhyLayer, setActiveWhyLayer] = useState<number>(1);
    const [showWhyPanel, setShowWhyPanel] = useState<boolean>(false);
    const [showSideQuest, setShowSideQuest] = useState<boolean>(false);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const stateRef = useRef<{
        tick: number;
        particles: Array<{ x: number; y: number; vx: number; vy: number; color: string; size: number; alpha: number }>;
        electronPos: number;
        wavePhase: number;
    }>({
        tick: 0,
        particles: [],
        electronPos: 50,
        wavePhase: 0,
    });

    // Reset parameters to defaults
    const handleReset = useCallback(() => {
        const defaults: Record<string, number> = {};
        config.params.forEach((p) => {
            defaults[p.id] = p.defaultValue;
        });
        setParams(defaults);
        setSign(config.defaultSign ?? 1);
        if (soundEnabled) sound.playClick();
    }, [config, soundEnabled]);

    // Handle parameter slider change
    const updateParam = (id: string, val: number) => {
        setParams((prev) => ({ ...prev, [id]: val }));
    };

    // Toggle + / - operator
    const toggleSign = () => {
        setSign((s) => (s > 0 ? -1 : 1));
        if (soundEnabled) sound.playSignFlip();
    };

    // Current formula LaTeX string
    const formulaLatex = useMemo(() => {
        try {
            return config.formulaBuilder(params, sign);
        } catch {
            return config.formulaTemplate;
        }
    }, [config, params, sign]);

    // Initialize particle pool
    useEffect(() => {
        const p: typeof stateRef.current.particles = [];
        for (let i = 0; i < 40; i++) {
            p.push({
                x: Math.random() * 600,
                y: Math.random() * 320,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                color: Math.random() > 0.5 ? "#00F5D4" : "#F59E0B",
                size: Math.random() * 3 + 1.5,
                alpha: Math.random() * 0.7 + 0.3,
            });
        }
        stateRef.current.particles = p;
    }, [config.type]);

    // 60 FPS Canvas Rendering Engine
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let running = true;

        const render = () => {
            if (!running) return;

            // Handle DPI
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            const w = rect.width || 600;
            const h = rect.height || 340;

            if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
                canvas.width = Math.floor(w * dpr);
                canvas.height = Math.floor(h * dpr);
            }

            ctx.save();
            ctx.scale(dpr, dpr);

            if (isPlaying) {
                stateRef.current.tick += 1;
                stateRef.current.wavePhase += 0.05 * sign;
            }

            const tick = stateRef.current.tick;

            // 1. Draw retro dark background
            ctx.fillStyle = "#070B12";
            ctx.fillRect(0, 0, w, h);

            // 2. Draw subtle grid
            ctx.strokeStyle = "#121C2E";
            ctx.lineWidth = 1;
            const gridSize = 24;
            for (let x = 0; x < w; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (let y = 0; y < h; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }

            // 3. Render specific simulation according to chapter type
            const simType = config.type;

            // ==========================================
            // SIMULATION: QUANTUM TUNNELING (REFERENCE)
            // ==========================================
            if (simType === "tunneling") {
                const L = params.barrier_width ?? 1.2;
                const V0 = params.barrier_height ?? 4.5;
                const E = params.particle_energy ?? 2.5;

                const barrierX = w * 0.45;
                const barrierW = Math.max(20, L * 35);
                const barrierH = Math.min(h * 0.75, (V0 / 6) * (h * 0.7));

                // Draw Potential Energy Baseline
                ctx.strokeStyle = "#2A3A54";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(30, h * 0.8);
                ctx.lineTo(barrierX, h * 0.8);
                ctx.lineTo(barrierX, h * 0.8 - barrierH);
                ctx.lineTo(barrierX + barrierW, h * 0.8 - barrierH);
                ctx.lineTo(barrierX + barrierW, h * 0.8);
                ctx.lineTo(w - 30, h * 0.8);
                ctx.stroke();

                // Fill barrier region
                ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
                ctx.fillRect(barrierX, h * 0.8 - barrierH, barrierW, barrierH);
                ctx.strokeStyle = "#F59E0B";
                ctx.setLineDash([4, 4]);
                ctx.strokeRect(barrierX, h * 0.8 - barrierH, barrierW, barrierH);
                ctx.setLineDash([]);

                // Label Barrier V0 & L
                ctx.fillStyle = "#F59E0B";
                ctx.font = "10px 'Press Start 2P', monospace";
                ctx.fillText(`V0 = ${V0} eV`, barrierX + 6, h * 0.8 - barrierH - 8);
                ctx.fillText(`L = ${L} nm`, barrierX + 6, h * 0.8 + 20);

                // Particle Energy Line E
                const energyY = h * 0.8 - (E / 6) * (h * 0.7);
                ctx.strokeStyle = "rgba(0, 245, 212, 0.5)";
                ctx.setLineDash([6, 6]);
                ctx.beginPath();
                ctx.moveTo(30, energyY);
                ctx.lineTo(w - 30, energyY);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillStyle = "#00F5D4";
                ctx.fillText(`E = ${E} eV`, 36, energyY - 6);

                // Wavefunction Ψ(x) propagation
                ctx.beginPath();
                ctx.lineWidth = 2.5;
                ctx.strokeStyle = "#00F5D4";

                const kappa = 0.08 * Math.sqrt(Math.max(0.1, V0 - E));
                const k1 = 0.12 * Math.sqrt(E);

                for (let x = 30; x < w - 30; x += 2) {
                    let yVal = energyY;
                    if (x < barrierX) {
                        // Incident & Reflected wave
                        const incident = Math.sin((x * k1 * sign) - tick * 0.08 * sign) * 22;
                        const reflected = sign > 0 ? Math.sin((-x * k1) - tick * 0.08) * 12 : 0;
                        yVal = energyY + incident + reflected;
                    } else if (x >= barrierX && x <= barrierX + barrierW) {
                        // Exponential Decay inside barrier
                        const dx = x - barrierX;
                        const decay = Math.exp(-kappa * dx) * Math.sin(tick * 0.05) * 18;
                        yVal = energyY + decay;
                    } else {
                        // Transmitted Wave
                        const transAmp = Math.exp(-kappa * barrierW) * 22;
                        const trans = Math.sin((x * k1 * sign) - tick * 0.08 * sign) * Math.max(4, transAmp);
                        yVal = energyY + trans;
                    }

                    if (x === 30) ctx.moveTo(x, yVal);
                    else ctx.lineTo(x, yVal);
                }
                ctx.stroke();

                // Electron Wavepacket Sprite
                const dir = sign >= 0 ? 1 : -1;
                stateRef.current.electronPos += dir * (isPlaying ? 1.4 : 0);
                if (stateRef.current.electronPos > w - 40) stateRef.current.electronPos = 40;
                if (stateRef.current.electronPos < 40) stateRef.current.electronPos = w - 40;

                const ex = stateRef.current.electronPos;
                const ey = energyY;

                // Glowing electron circle
                const grad = ctx.createRadialGradient(ex, ey, 2, ex, ey, 14);
                grad.addColorStop(0, "#00F5D4");
                grad.addColorStop(0.5, "rgba(0, 245, 212, 0.4)");
                grad.addColorStop(1, "rgba(0, 245, 212, 0)");
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(ex, ey, 14, 0, Math.PI * 2);
                ctx.fill();

                // Velocity Arrow
                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(ex, ey - 18);
                ctx.lineTo(ex + dir * 26, ey - 18);
                ctx.lineTo(ex + dir * 18, ey - 22);
                ctx.moveTo(ex + dir * 26, ey - 18);
                ctx.lineTo(ex + dir * 18, ey - 14);
                ctx.stroke();

                ctx.fillStyle = "#FFFFFF";
                ctx.font = "8px 'Press Start 2P', monospace";
                ctx.fillText(`v = ${dir > 0 ? "+v" : "-v"}`, ex - 16, ey - 26);
            }

            // ==========================================
            // SIMULATION: CHAPTER 10 MOSFET SANDBOX
            // ==========================================
            else if (simType === "mosfet") {
                const tox = params.oxide_thickness ?? 1.4;
                const vgs = (params.gate_voltage ?? 0.9) * (sign >= 0 ? 1 : -1);
                const na = params.substrate_doping ?? 17.5;
                const vth = 0.35 + (tox - 1.0) * 0.08;
                const isChannelOn = vgs > vth;

                // Silicon Substrate Block (P-type)
                ctx.fillStyle = "#111827";
                ctx.fillRect(40, 100, w - 80, 160);
                ctx.strokeStyle = "#22324D";
                ctx.lineWidth = 2;
                ctx.strokeRect(40, 100, w - 80, 160);

                ctx.fillStyle = "#64748B";
                ctx.font = "9px 'Press Start 2P', monospace";
                ctx.fillText(`P-Substrate (Si: 10^${na.toFixed(1)} cm⁻³)`, 55, 230);

                // Source N+
                ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
                ctx.fillRect(60, 100, 70, 60);
                ctx.strokeStyle = "#38BDF8";
                ctx.strokeRect(60, 100, 70, 60);
                ctx.fillStyle = "#38BDF8";
                ctx.fillText("SOURCE (N+)", 64, 135);

                // Drain N+
                ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
                ctx.fillRect(w - 130, 100, 70, 60);
                ctx.strokeStyle = "#38BDF8";
                ctx.strokeRect(w - 130, 100, 70, 60);
                ctx.fillStyle = "#38BDF8";
                ctx.fillText("DRAIN (N+)", w - 124, 135);

                // Gate Oxide Dielectric Layer (HfO2 / SiO2)
                const toxPx = Math.max(4, tox * 5);
                ctx.fillStyle = "rgba(245, 158, 11, 0.4)";
                ctx.fillRect(145, 100 - toxPx, w - 290, toxPx);
                ctx.strokeStyle = "#F59E0B";
                ctx.strokeRect(145, 100 - toxPx, w - 290, toxPx);

                // Gate Metal Electrode
                ctx.fillStyle = "#1E293B";
                ctx.fillRect(145, 100 - toxPx - 26, w - 290, 26);
                ctx.strokeStyle = "#00F5D4";
                ctx.strokeRect(145, 100 - toxPx - 26, w - 290, 26);
                ctx.fillStyle = "#00F5D4";
                ctx.fillText(`GATE (V_GS = ${vgs.toFixed(2)}V)`, 160, 100 - toxPx - 10);

                // Inversion Channel Layer
                if (isChannelOn) {
                    const channelAlpha = Math.min(1, (vgs - vth) * 1.5);
                    ctx.fillStyle = `rgba(0, 245, 212, ${channelAlpha * 0.7})`;
                    ctx.fillRect(130, 100, w - 260, 12);
                    ctx.fillStyle = "#00F5D4";
                    ctx.fillText("● INVERSION CHANNEL (ON)", 155, 128);

                    // Flowing Electrons in Channel
                    ctx.fillStyle = "#FFFFFF";
                    for (let i = 0; i < 18; i++) {
                        const ex = 135 + ((i * 22 + tick * 3) % (w - 270));
                        ctx.beginPath();
                        ctx.arc(ex, 106, 2.5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                } else {
                    ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
                    ctx.fillRect(130, 100, w - 260, 16);
                    ctx.fillStyle = "#EF4444";
                    ctx.fillText("✕ PINCH-OFF (OFF: V_GS < V_th)", 150, 128);
                }

                // Status Matrix Banner
                ctx.fillStyle = "#0E1524";
                ctx.fillRect(40, 275, w - 80, 50);
                ctx.strokeStyle = isChannelOn ? "#00F5D4" : "#EF4444";
                ctx.strokeRect(40, 275, w - 80, 50);

                ctx.fillStyle = isChannelOn ? "#00F5D4" : "#EF4444";
                ctx.font = "8px 'Press Start 2P', monospace";
                ctx.fillText(`V_th: ${vth.toFixed(2)}V  |  t_ox: ${tox}nm  |  STATE: ${isChannelOn ? "CONDUCTION (1)" : "CUTOFF (0)"}`, 50, 295);
                ctx.fillStyle = "#94A3B8";
                ctx.fillText(`Ion/Ioff Ratio: ${isChannelOn ? "> 10^6" : "≈ 1 (Subthreshold Leakage)"}`, 50, 312);
            }

            // ==========================================
            // SIMULATION: CHAPTER 13 CAPSTONE CHIP BUILDER
            // ==========================================
            else if (simType === "capstone_chip") {
                const node = params.node_size ?? 3;
                const vdd = params.voltage_overdrive ?? 0.8;
                const isTurbo = sign >= 0;

                // Silicon Wafer Chiplet Frame
                ctx.fillStyle = "#0B1220";
                ctx.fillRect(35, 45, w - 70, 220);
                ctx.strokeStyle = isTurbo ? "#00F5D4" : "#38BDF8";
                ctx.lineWidth = 2;
                ctx.strokeRect(35, 45, w - 70, 220);

                // Bus interconnections (copper traces)
                ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(60, 95);
                ctx.lineTo(w - 60, 95);
                ctx.moveTo(60, 185);
                ctx.lineTo(w - 60, 185);
                ctx.stroke();

                // Logic Core Blocks
                const blocks = [
                    { name: "ALU-64", x: 60, y: 70, w: 90, h: 50, col: "#00F5D4" },
                    { name: "REG-FILE", x: 175, y: 70, w: 90, h: 50, col: "#38BDF8" },
                    { name: "SRAM-L1", x: 290, y: 70, w: 95, h: 50, col: "#A855F7" },
                    { name: "NPU-CORE", x: 410, y: 70, w: 100, h: 50, col: "#F59E0B" },
                    { name: "CLOCK-GEN", x: 60, y: 160, w: 120, h: 50, col: "#10B981" },
                    { name: "BSPDN-RAIL", x: 205, y: 160, w: 140, h: 50, col: "#F43F5E" },
                    { name: "CHIPLET-PHY", x: 370, y: 160, w: 140, h: 50, col: "#00F5D4" },
                ];

                blocks.forEach((b) => {
                    ctx.fillStyle = "#111827";
                    ctx.fillRect(b.x, b.y, b.w, b.h);
                    ctx.strokeStyle = b.col;
                    ctx.lineWidth = 1.5;
                    ctx.strokeRect(b.x, b.y, b.w, b.h);

                    ctx.fillStyle = b.col;
                    ctx.font = "8px 'Press Start 2P', monospace";
                    ctx.fillText(b.name, b.x + 6, b.y + 28);

                    // Activity indicator LED
                    ctx.fillStyle = (tick % 30 < 15) ? b.col : "#334155";
                    ctx.fillRect(b.x + b.w - 10, b.y + 6, 4, 4);
                });

                // Performance Matrix Dashboard
                const freq = isTurbo ? (4.2 - (node - 2) * 0.15).toFixed(1) : (2.5 - (node - 2) * 0.1).toFixed(1);
                const power = isTurbo ? (75 + (14 - node) * 3).toFixed(0) : (20 + (14 - node) * 1.2).toFixed(0);

                ctx.fillStyle = "#0E1524";
                ctx.fillRect(35, 275, w - 70, 50);
                ctx.strokeStyle = "#F59E0B";
                ctx.strokeRect(35, 275, w - 70, 50);

                ctx.fillStyle = "#F59E0B";
                ctx.font = "8px 'Press Start 2P', monospace";
                ctx.fillText(`NODE: ${node}nm GAA  |  CLK: ${freq} GHz  |  TDP: ${power}W  |  MODE: ${isTurbo ? "TURBO (+)" : "ECO (−)"}`, 45, 296);
                ctx.fillStyle = "#38BDF8";
                ctx.fillText(`PPA Efficiency: ${((parseFloat(freq) * 1000) / parseFloat(power)).toFixed(1)} GigaOps/Watt`, 45, 313);
            }

            // ==========================================
            // DEFAULT / GENERAL SIMULATION VISUALIZER
            // ==========================================
            else {
                // Harmonic quantum oscillator / wave canvas
                ctx.strokeStyle = "#00F5D4";
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let x = 30; x < w - 30; x += 3) {
                    const k = 0.04 * sign;
                    const y = h * 0.5 + Math.sin(x * k + tick * 0.05) * 45 * Math.sin((x / w) * Math.PI);
                    if (x === 30) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();

                // Particle cloud
                stateRef.current.particles.forEach((pt) => {
                    pt.x += pt.vx * sign;
                    pt.y += pt.vy;
                    if (pt.x < 30) pt.x = w - 30;
                    if (pt.x > w - 30) pt.x = 30;
                    if (pt.y < 40) pt.y = h - 40;
                    if (pt.y > h - 40) pt.y = 40;

                    ctx.fillStyle = pt.color;
                    ctx.globalAlpha = pt.alpha;
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1.0;
                });

                ctx.fillStyle = "#94A3B8";
                ctx.font = "9px 'Press Start 2P', monospace";
                ctx.fillText(`[ ${config.type.toUpperCase()} QUANTUM ENGINE: 60 FPS ]`, 40, h - 20);
            }

            ctx.restore();
            animFrameRef.current = requestAnimationFrame(render);
        };

        animFrameRef.current = requestAnimationFrame(render);

        return () => {
            running = false;
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [config, params, sign, isPlaying]);

    return (
        <div className="flex flex-col gap-4" data-testid="simulation-engine-container">
            {/* Top Toolbar: Mode Badge, Formula Display, Sign-Flip Toggle */}
            <PixelPanel tone="sim" className="p-4" data-testid="simulation-header-panel">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <PixelTag tone="quantum">{chapterCode}</PixelTag>
                        <PixelTag tone="energy">{isSandbox ? "SANDBOX MODE" : "GUIDED ENGINE"}</PixelTag>
                        <span className="flex items-center gap-1 font-pixel text-[8px] text-success">
                            <span className="inline-block size-2 rounded-full bg-success animate-pulse" />
                            60 FPS READY
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <PixelButton
                            size="sm"
                            variant={isSandbox ? "primary" : "outline"}
                            onClick={() => {
                                setIsSandbox((v) => !v);
                                if (soundEnabled) sound.playClick();
                            }}
                            data-testid="toggle-sandbox-btn"
                        >
                            <Sliders className="size-3.5" />
                            {isSandbox ? t("lesson") : "Free Sandbox"}
                        </PixelButton>

                        <PixelButton
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsPlaying((p) => !p)}
                            data-testid="play-pause-btn"
                        >
                            {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                        </PixelButton>

                        <PixelButton
                            size="sm"
                            variant="ghost"
                            onClick={handleReset}
                            data-testid="reset-sim-btn"
                        >
                            <RotateCcw className="size-3.5" />
                        </PixelButton>
                    </div>
                </div>

                {/* KaTeX Live Formula Readout */}
                <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-border pt-3 sm:flex-row">
                    <div className="overflow-x-auto text-base text-quantum font-mono" data-testid="live-formula-display">
                        <Tex math={formulaLatex} block />
                    </div>

                    {/* Interactive Sign Toggle (+ / -) */}
                    {config.hasSignFlip && (
                        <div className="flex items-center gap-2" data-testid="sign-flip-control">
                            <span className="font-pixel text-[8px] text-muted-foreground uppercase">
                                {loc(config.signLabel ?? { id: "Operator Arah", en: "Operator Sign" })}:
                            </span>
                            <button
                                type="button"
                                onClick={toggleSign}
                                className={cn(
                                    "flex size-9 items-center justify-center border-2 font-pixel text-sm font-bold transition-all duration-150 cursor-pointer shadow-[2px_2px_0px_#000]",
                                    sign > 0
                                        ? "border-quantum bg-quantum text-on-quantum hover:scale-105"
                                        : "border-chip bg-chip text-on-chip hover:scale-105",
                                )}
                                data-testid="sign-flip-toggle-btn"
                                aria-label="Toggle Sign Operator"
                            >
                                {sign > 0 ? "+" : "−"}
                            </button>
                        </div>
                    )}
                </div>
            </PixelPanel>

            {/* In-Game Sign Explanation Alert Banner */}
            {config.hasSignFlip && config.signExplanation && (
                <div
                    className={cn(
                        "flex items-start gap-3 border-2 p-3 font-mono text-xs transition-colors duration-200",
                        sign > 0 ? "border-quantum/60 bg-quantum/5 text-foreground" : "border-chip/70 bg-chip/10 text-foreground",
                    )}
                    data-testid="sign-explanation-banner"
                >
                    <AlertCircle className={cn("size-4 shrink-0 mt-0.5", sign > 0 ? "text-quantum" : "text-chip")} />
                    <div>
                        <span className="font-pixel text-[8px] uppercase tracking-wider text-chip mr-2">
                            [ OPERATOR SIGN: {sign > 0 ? "(+) POSITIVE" : "(−) NEGATIVE"} ]
                        </span>
                        <span>{loc(config.signExplanation)}</span>
                    </div>
                </div>
            )}

            {/* Interactive 60fps Simulation Canvas Stage */}
            <div className="relative overflow-hidden border-2 border-border bg-[#070B12]">
                <canvas
                    ref={canvasRef}
                    className="h-72 w-full touch-none sm:h-96"
                    style={{ imageRendering: "pixelated" }}
                    data-testid="interactive-sim-canvas"
                />

                {/* Corner Pixel Crosshair Ticks */}
                {["top-2 left-2 border-t border-l", "top-2 right-2 border-t border-r", "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"].map((c) => (
                    <span key={c} className={`pointer-events-none absolute size-3 border-quantum/70 ${c}`} aria-hidden />
                ))}
            </div>

            {/* Editable Parameter Sliders Bar */}
            <PixelPanel label="PARAM.CONTROLS" className="p-4" data-testid="parameter-sliders-panel">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {config.params.map((p) => {
                        const val = params[p.id] ?? p.defaultValue;
                        return (
                            <div key={p.id} className="flex flex-col gap-1.5" data-testid={`param-control-${p.id}`}>
                                <div className="flex items-center justify-between text-xs font-mono">
                                    <span className="text-muted-foreground">{loc(p.label)}</span>
                                    <span className="font-pixel text-[9px] text-quantum">
                                        {val} {p.unit ?? ""}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min={p.min}
                                    max={p.max}
                                    step={p.step}
                                    value={val}
                                    onChange={(e) => updateParam(p.id, parseFloat(e.target.value))}
                                    className="h-2 w-full accent-[#00F5D4] cursor-pointer bg-locked"
                                    data-testid={`slider-${p.id}`}
                                />
                            </div>
                        );
                    })}
                </div>
            </PixelPanel>

            {/* Accordion Buttons: "Ask Why" & "Side Quest" */}
            <div className="flex flex-wrap gap-3">
                <PixelButton
                    variant="chip"
                    className="flex-1"
                    onClick={() => {
                        setShowWhyPanel((v) => !v);
                        if (soundEnabled) sound.playClick();
                    }}
                    data-testid="open-ask-why-btn"
                >
                    <HelpCircle className="size-4" />
                    <span>{loc({ id: "Tanya Mengapa (3 Lapisan)", en: "Ask Why (3 Layers)" })}</span>
                    {showWhyPanel ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                </PixelButton>

                {sideQuest && (
                    <PixelButton
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                            setShowSideQuest((v) => !v);
                            if (soundEnabled) sound.playClick();
                        }}
                        data-testid="open-sidequest-btn"
                    >
                        <Cpu className="size-4" />
                        <span>{loc({ id: "Studi Kasus Chip Nyata", en: "Real-World Chip Case" })}</span>
                        {showSideQuest ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                    </PixelButton>
                )}
            </div>

            {/* Layered "Ask Why" Panel */}
            {showWhyPanel && (
                <PixelPanel tone="chip" className="p-5" data-testid="ask-why-expanded-panel">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-chip/40 pb-3">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4 text-chip" />
                            <h3 className="font-heading text-lg font-bold text-chip">{loc(askWhy.title)}</h3>
                        </div>

                        {/* 3 Layer Tabs */}
                        <div className="flex gap-1" role="tablist">
                            {[
                                { layer: 1, label: { id: "1. Intuisi", en: "1. Intuition" } },
                                { layer: 2, label: { id: "2. Fisika", en: "2. Physics" } },
                                { layer: 3, label: { id: "3. Chip", en: "3. Chip Tech" } },
                            ].map((tab) => (
                                <button
                                    key={tab.layer}
                                    type="button"
                                    onClick={() => {
                                        setActiveWhyLayer(tab.layer);
                                        if (soundEnabled) sound.playClick();
                                    }}
                                    className={cn(
                                        "px-2.5 py-1 font-pixel text-[8px] uppercase tracking-wider transition-colors cursor-pointer border",
                                        activeWhyLayer === tab.layer
                                            ? "border-chip bg-chip text-on-chip"
                                            : "border-border bg-panel text-muted-foreground hover:text-foreground",
                                    )}
                                    data-testid={`why-layer-tab-${tab.layer}`}
                                >
                                    {loc(tab.label)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 font-mono text-sm leading-relaxed text-foreground">
                        {activeWhyLayer === 1 && (
                            <div data-testid="why-layer-1-content">
                                <span className="font-pixel text-[9px] uppercase tracking-widest text-chip block mb-1">
                                    [ TINGKAT 1: INTUISI SEHARI-HARI ]
                                </span>
                                <p>{loc(askWhy.simple)}</p>
                            </div>
                        )}
                        {activeWhyLayer === 2 && (
                            <div data-testid="why-layer-2-content">
                                <span className="font-pixel text-[9px] uppercase tracking-widest text-quantum block mb-1">
                                    [ TINGKAT 2: MEKANISME FISIKA KUANTUM ]
                                </span>
                                <p>{loc(askWhy.deep)}</p>
                            </div>
                        )}
                        {activeWhyLayer === 3 && (
                            <div data-testid="why-layer-3-content">
                                <span className="font-pixel text-[9px] uppercase tracking-widest text-energy block mb-1">
                                    [ TINGKAT 3: REALITAS INDUSTRI CHIP ]
                                </span>
                                <p>{loc(askWhy.chip)}</p>
                            </div>
                        )}
                    </div>
                </PixelPanel>
            )}

            {/* Real-World Side Quest Card */}
            {showSideQuest && sideQuest && (
                <PixelPanel tone="quantum" className="p-5" data-testid="sidequest-expanded-panel">
                    <div className="flex items-center justify-between border-b border-quantum/40 pb-2">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4 text-quantum" />
                            <h4 className="font-heading font-bold text-quantum">{loc(sideQuest.title)}</h4>
                        </div>
                        <PixelTag tone="quantum">{loc(sideQuest.tag)}</PixelTag>
                    </div>
                    <p className="mt-3 font-mono text-sm leading-relaxed text-muted-foreground">
                        {loc(sideQuest.description)}
                    </p>
                    <div className="mt-3 flex items-center gap-2 border-t border-border pt-2 text-xs font-mono text-chip">
                        <Cpu className="size-3.5" />
                        <span>Hardware Acuan: {loc(sideQuest.realWorldTech)}</span>
                    </div>
                </PixelPanel>
            )}
        </div>
    );
}
