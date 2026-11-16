import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
    ArrowLeft,
    ArrowRight,
    Award,
    BookOpen,
    Check,
    ChevronRight,
    Download,
    HelpCircle,
    Info,
    Languages,
    Lock,
    Moon,
    Play,
    RotateCcw,
    Search,
    Send,
    Settings as SettingsIcon,
    Sparkles,
    Trophy,
    Volume2,
    VolumeX,
    Zap,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";

import {
    CHAPTERS,
    ERA_COUNT,
    TOTAL_CHAPTERS,
    useGameStore,
    useLang,
    useLocalized,
    useT,
    exportJournalAsText,
    BADGE_DEFINITIONS,
} from "./app-state";
import { CURRICULUM, getChapterFull } from "./curriculum";
import type { ChapterMeta } from "./app-state";
import { SimulationCanvas } from "./simulation-engine";

import {
    cn,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Input,
    LangToggle,
    PixelAtom,
    PixelButton,
    pixelButton,
    PixelPanel,
    PixelTag,
    Tex,
} from "./ui-components";
import { sound } from "./sound";

// Toast notification container trigger
export const toast = {
    success: (message: string) => {
        const toaster = document.getElementById("toaster");
        if (!toaster) return;
        const toastEl = document.createElement("div");
        toastEl.className =
            "pointer-events-auto border-2 border-quantum bg-panel px-4 py-2 font-mono text-xs text-quantum shadow-lg transition-opacity duration-300";
        toastEl.innerText = message;
        toaster.appendChild(toastEl);
        setTimeout(() => {
            toastEl.style.opacity = "0";
            setTimeout(() => toastEl.remove(), 300);
        }, 3000);
    },
};

// ==========================================
// 1. HOME SCREEN
// ==========================================
const PARTICLES = [
    { x: "8%", y: "18%", c: "bg-quantum", d: "0s" },
    { x: "88%", y: "12%", c: "bg-chip", d: "0.6s" },
    { x: "78%", y: "64%", c: "bg-energy", d: "1.2s" },
    { x: "14%", y: "78%", c: "bg-wave", d: "1.8s" },
    { x: "52%", y: "8%", c: "bg-quantum", d: "2.4s" },
    { x: "92%", y: "86%", c: "bg-quantum", d: "0.9s" },
];

export function Home() {
    const t = useT("home");
    const navigate = useNavigate();
    const current = useGameStore((s) => s.currentChapter);
    const xp = useGameStore((s) => s.xp);
    const completed = useGameStore((s) => s.completedChapters.length);
    const soundEnabled = useGameStore((s) => s.soundEnabled);
    const hasSave = xp > 0 || completed > 0 || current > 1;

    const startAdventure = () => {
        if (soundEnabled) sound.playClick();
        navigate("/map");
    };

    const continueAdventure = () => {
        if (soundEnabled) sound.playClick();
        navigate(`/chapter/${current}`);
    };

    return (
        <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background bg-lab-grid">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_oklab,var(--quantum)_14%,transparent),transparent_60%)]" aria-hidden />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_90%,color-mix(in_oklab,var(--energy)_12%,transparent),transparent_55%)]" aria-hidden />
            <div className="pointer-events-none absolute inset-0 scanlines opacity-40 dark:opacity-60" aria-hidden />
            {PARTICLES.map((p, i) => (
                <span
                    key={i}
                    className={`pointer-events-none absolute size-2 ${p.c} animate-float-px opacity-70`}
                    style={{ left: p.x, top: p.y, animationDelay: p.d }}
                    aria-hidden
                />
            ))}

            <div className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-8 sm:py-6">
                <div className="flex items-center gap-2">
                    <PixelAtom size={28} />
                    <span className="font-pixel text-[9px] tracking-widest text-muted-foreground">v1.0-RELEASE</span>
                </div>
                <div className="flex items-center gap-2">
                    <LangToggle size="md" />
                    <Link
                        to="/settings"
                        aria-label="Settings"
                        data-testid="home-settings-link"
                        className="grid size-10 place-items-center border-2 border-border bg-panel text-muted-foreground transition-colors duration-150 hover:border-quantum hover:text-quantum"
                    >
                        <SettingsIcon className="size-4" />
                    </Link>
                </div>
            </div>

            <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 pb-12 sm:px-8 lg:flex-row lg:items-center lg:gap-16">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="max-w-2xl"
                >
                    <p className="mb-5 font-mono text-xs text-quantum sm:text-sm" data-testid="home-boot-line">
                        {t("bootLine")}
                        <span className="ml-1 inline-block h-3.5 w-2 translate-y-0.5 bg-quantum animate-blink" aria-hidden />
                    </p>
                    <PixelTag tone="chip" className="mb-4">
                        {t("eyebrow")}
                    </PixelTag>
                    <h1
                        className="font-heading text-5xl font-bold leading-[0.95] tracking-tighter sm:text-7xl lg:text-8xl"
                        data-testid="home-title"
                    >
                        Quantum
                        <span className="block text-quantum text-glow animate-flicker">Lab</span>
                    </h1>
                    <p className="mt-4 font-pixel text-[11px] leading-relaxed tracking-wider text-chip sm:text-sm" data-testid="home-subtitle">
                        {t("subtitle")}
                    </p>
                    <p className="mt-6 max-w-xl font-mono text-sm leading-relaxed text-muted-foreground sm:text-[15px]" data-testid="home-description">
                        {t("description")}
                    </p>

                    <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-stretch">
                        <PixelButton size="lg" onClick={startAdventure} data-testid="start-adventure-btn">
                            <Play className="fill-current" />
                            {t("start")}
                        </PixelButton>
                        <PixelButton
                            size="lg"
                            variant="outline"
                            disabled={!hasSave}
                            onClick={continueAdventure}
                            data-testid="continue-btn"
                            className="flex-col !items-start gap-0.5 py-2 sm:min-w-56"
                        >
                            <span className="flex items-center gap-2">
                                {t("continue")} <ArrowRight />
                            </span>
                            <span className="font-mono text-[11px] font-normal opacity-80" data-testid="continue-hint">
                                {hasSave ? t("continueHint", { n: current, xp }) : t("noSave")}
                            </span>
                        </PixelButton>
                    </div>
                </motion.div>

                <motion.dl
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
                    className="mt-14 grid grid-cols-3 gap-3 lg:mt-0 lg:w-64 lg:grid-cols-1"
                    data-testid="home-stats"
                >
                    {[
                        { v: TOTAL_CHAPTERS, k: "statChapters", c: "text-quantum border-quantum/40" },
                        { v: ERA_COUNT, k: "statEras", c: "text-chip border-chip/40" },
                        { v: TOTAL_CHAPTERS * 5, k: "statQuiz", c: "text-energy border-energy/40" },
                    ].map((s) => (
                        <div key={s.k} className={`border-2 bg-panel/70 p-3 backdrop-blur-sm sm:p-4 ${s.c}`}>
                            <dt className="font-mono text-[11px] text-muted-foreground sm:text-xs">{t(s.k)}</dt>
                            <dd className="mt-2 font-pixel text-lg sm:text-2xl">{String(s.v).padStart(2, "0")}</dd>
                        </div>
                    ))}
                </motion.dl>
            </main>

            <footer className="relative z-10 px-5 pb-6 font-mono text-[11px] text-muted-foreground sm:px-8">
                h = 6.626 × 10⁻³⁴ J·s · Quantum Lab 2026
            </footer>
        </div>
    );
}

// ==========================================
// 2. ADVENTURE MAP SCREEN
// ==========================================
type NodeState = "completed" | "current" | "unlocked" | "locked";

function ChapterNode({ ch, state, index }: { ch: ChapterMeta; state: NodeState; index: number }) {
    const t = useT();
    const loc = useLocalized();
    const soundEnabled = useGameStore((s) => s.soundEnabled);
    const locked = state === "locked";
    const right = index % 2 === 1;

    const tag = {
        completed: <PixelTag tone="success"><Check className="size-2.5" />{t("common.completed")}</PixelTag>,
        current: <PixelTag tone="chip">{t("common.current")}</PixelTag>,
        unlocked: <PixelTag tone="quantum">{t("common.unlocked")}</PixelTag>,
        locked: <PixelTag><Lock className="size-2.5" />{t("common.locked")}</PixelTag>,
    }[state];

    const marker = (
        <div
            className={cn(
                "relative z-10 grid size-12 shrink-0 place-items-center border-2 font-pixel text-[11px] transition-[transform,box-shadow] duration-200",
                state === "completed" && "border-success bg-success text-background",
                state === "current" && "border-chip bg-chip text-on-chip shadow-[0_0_0_4px_color-mix(in_oklab,var(--chip)_25%,transparent)]",
                state === "unlocked" && "border-quantum bg-panel text-quantum",
                state === "locked" && "border-border bg-locked text-muted-foreground",
            )}
            aria-hidden
        >
            {locked ? <Lock className="size-4" /> : String(ch.id).padStart(2, "0")}
            {state === "current" && <span className="absolute -inset-1.5 animate-ping border-2 border-chip/40" />}
        </div>
    );

    const card = (
        <div
            className={cn(
                "group flex-1 border-2 p-4 transition-[transform,box-shadow,border-color] duration-200",
                locked
                    ? "border-dashed border-border bg-locked/70"
                    : "border-border bg-panel hover:-translate-y-0.5 hover:border-quantum hover:shadow-[4px_4px_0_0_var(--quantum)]",
                state === "current" && "border-chip/70 shadow-[4px_4px_0_0_var(--chip)] hover:border-chip hover:shadow-[4px_4px_0_0_var(--chip)]",
            )}
        >
            <div className="flex flex-wrap items-center gap-2">
                <span className="font-pixel text-[9px] tracking-widest text-muted-foreground">{ch.code}</span>
                {tag}
            </div>
            <h3 className={cn("mt-2 font-heading text-lg font-semibold leading-snug tracking-tight", locked && "text-muted-foreground")}>
                {loc(ch.title)}
            </h3>
            <div className={cn("mt-2 overflow-x-auto text-sm", locked ? "opacity-40" : "text-quantum")}>
                <Tex math={ch.formula} />
            </div>
            {locked ? (
                <p className="mt-2 font-mono text-[11px] text-muted-foreground">{t("map.lockedHint")}</p>
            ) : (
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-quantum transition-[gap] duration-150 group-hover:gap-2">
                    {t("map.enter")} <ChevronRight className="size-3.5" />
                </span>
            )}
        </div>
    );

    const inner = (
        <div className={cn("flex items-start gap-4", right && "md:flex-row-reverse md:text-right")}>
            {marker}
            <div className={cn("flex flex-1", right && "md:justify-end")}>{card}</div>
        </div>
    );

    return (
        <motion.li
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn("relative md:w-1/2", right ? "md:ml-auto md:pl-0" : "md:mr-auto")}
            data-testid={`chapter-node-${ch.id}`}
            data-state={state}
        >
            {locked ? (
                <div aria-disabled className="cursor-not-allowed">{inner}</div>
            ) : (
                <Link
                    to={`/chapter/${ch.id}`}
                    onClick={() => { if (soundEnabled) sound.playClick(); }}
                    className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quantum"
                    data-testid={`chapter-node-link-${ch.id}`}
                >
                    {inner}
                </Link>
            )}
        </motion.li>
    );
}

export function AdventureMap() {
    const t = useT("map");
    const unlocked = useGameStore((s) => s.unlockedChapters);
    const completed = useGameStore((s) => s.completedChapters);
    const current = useGameStore((s) => s.currentChapter);
    const pct = Math.round((completed.length / TOTAL_CHAPTERS) * 100);

    const stateOf = (id: number): NodeState => {
        if (!unlocked.includes(id)) return "locked";
        if (id === current) return "current";
        if (completed.includes(id)) return "completed";
        return "unlocked";
    };

    return (
        <div>
            <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl" data-testid="map-title">
                        {t("title")}
                    </h1>
                    <p className="mt-2 max-w-xl font-mono text-sm text-muted-foreground">{t("subtitle")}</p>
                </div>
                <div className="w-full md:w-80" data-testid="map-progress">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-mono text-xs text-muted-foreground">
                            {t("progress", { done: completed.length, total: TOTAL_CHAPTERS })}
                        </p>
                        <span className="font-pixel text-[10px] text-quantum">{pct}%</span>
                    </div>
                    <div className="flex h-3 gap-0.5">
                        {Array.from({ length: TOTAL_CHAPTERS }, (_, i) => (
                            <span
                                key={i}
                                className={cn("flex-1", i < completed.length ? "bg-success" : unlocked.includes(i + 1) ? "bg-quantum/50" : "bg-locked border border-border")}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <ol className="relative flex flex-col gap-6" data-testid="map-path">
                <span
                    className="absolute top-0 bottom-0 left-[23px] w-0.5 bg-[repeating-linear-gradient(to_bottom,var(--border)_0_8px,transparent_8px_14px)] md:left-1/2 md:-translate-x-1/2"
                    aria-hidden
                />
                {CHAPTERS.map((ch, i) => {
                    const newEra = i === 0 || CHAPTERS[i - 1].era !== ch.era;
                    return (
                        <div key={ch.id} className="contents">
                            {newEra && (
                                <li className="relative z-10 flex md:justify-center" data-testid={`map-era-${ch.era}`}>
                                    <span className="ml-14 border-2 border-energy/60 bg-background px-3 py-1.5 font-pixel text-[9px] uppercase tracking-widest text-energy md:ml-0">
                                        {t(`eras.${ch.era}`)}
                                    </span>
                                </li>
                            )}
                            <ChapterNode ch={ch} state={stateOf(ch.id)} index={i} />
                        </div>
                    );
                })}
            </ol>
        </div>
    );
}

// ==========================================
// 3. CHAPTER VIEW SCREEN (FULL CURRICULUM + SIMULATION)
// ==========================================
export function ChapterView() {
    const t = useT("chapter");
    const tc = useT("common");
    const loc = useLocalized();
    const navigate = useNavigate();
    const { id } = useParams();
    const chapterId = Number(id) || 1;
    const fullData = getChapterFull(chapterId);

    const unlocked = useGameStore((s) => s.unlockedChapters.includes(chapterId));
    const completed = useGameStore((s) => s.completedChapters.includes(chapterId));
    const setCurrentChapter = useGameStore((s) => s.setCurrentChapter);
    const completeChapter = useGameStore((s) => s.completeChapter);
    const soundEnabled = useGameStore((s) => s.soundEnabled);

    const [celebrateOpen, setCelebrateOpen] = useState(false);

    useEffect(() => {
        if (fullData && unlocked) setCurrentChapter(chapterId);
    }, [fullData, unlocked, chapterId, setCurrentChapter]);

    if (!fullData || !unlocked) {
        return (
            <PixelPanel tone="default" className="mx-auto max-w-lg p-8 text-center" data-testid="chapter-locked">
                <Lock className="mx-auto size-10 text-muted-foreground" />
                <h1 className="mt-4 font-heading text-2xl font-bold">{fullData ? t("lockedTitle") : t("notFound")}</h1>
                <p className="mt-2 font-mono text-sm text-muted-foreground">{t("lockedBody")}</p>
                <Link to="/map" className={pixelButton({ variant: "outline", className: "mt-6" })} data-testid="chapter-back-to-map">
                    <ArrowLeft /> {t("toMap")}
                </Link>
            </PixelPanel>
        );
    }

    const handleCompleteChapter = () => {
        completeChapter(chapterId);
        if (soundEnabled) sound.playFanfare();
        setCelebrateOpen(true);
    };

    return (
        <div className="flex flex-col gap-6" data-testid="chapter-view-container">
            {/* Header with Navigation & Title */}
            <div className="flex flex-col gap-3">
                <Link to="/map" className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-quantum" data-testid="chapter-back-link">
                    <ArrowLeft className="size-4" /> {t("toMap")}
                </Link>
                <div className="flex flex-wrap items-center gap-2">
                    <PixelTag tone="chip">{fullData.code}</PixelTag>
                    <span className="font-pixel text-[9px] tracking-widest text-muted-foreground">
                        {tc("chapter")} {fullData.id}/{TOTAL_CHAPTERS}
                    </span>
                    {completed && <PixelTag tone="success">✓ {tc("completed")}</PixelTag>}
                </div>
                <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl" data-testid="chapter-title">
                    {loc(fullData.title)}
                </h1>
            </div>

            {/* Scientist Narrative & Core Concept Intro */}
            <PixelPanel tone="quantum" className="p-5" data-testid="chapter-intro-panel">
                <div className="flex items-start gap-3">
                    <PixelAtom size={32} className="shrink-0 mt-1" />
                    <div>
                        <span className="font-pixel text-[8px] uppercase tracking-widest text-quantum block mb-1">
                            [ LOG PENELITI: DR. KUANTUM ]
                        </span>
                        <p className="font-mono text-sm leading-relaxed text-foreground">
                            {loc(fullData.narrative)}
                        </p>
                        <div className="mt-3 border-l-2 border-quantum pl-3 font-mono text-xs text-muted-foreground">
                            <span className="font-bold text-quantum">Ide Pokok: </span>
                            {loc(fullData.coreConcept)}
                        </div>
                    </div>
                </div>
            </PixelPanel>

            {/* Interactive Simulation Canvas Engine */}
            <SimulationCanvas
                config={fullData.simulation}
                askWhy={fullData.askWhy}
                sideQuest={fullData.sideQuest}
                chapterCode={fullData.code}
            />

            {/* Bottom Action Bar: Complete Chapter & Take Quiz CTAs */}
            <div className="sticky bottom-20 z-30 flex flex-wrap gap-3 border-2 border-border bg-sidebar/90 p-3 backdrop-blur-md md:bottom-4" data-testid="chapter-action-bar">
                <PixelButton
                    variant={completed ? "outline" : "primary"}
                    onClick={handleCompleteChapter}
                    data-testid="complete-chapter-btn"
                >
                    <Check className="size-4" />
                    <span>{completed ? loc({ id: "Klaim Ulang (+50 XP)", en: "Completed (+50 XP)" }) : loc({ id: "Selesaikan Bab Ini (+50 XP)", en: "Complete Chapter (+50 XP)" })}</span>
                </PixelButton>

                <PixelButton
                    className="ml-auto"
                    onClick={() => {
                        if (soundEnabled) sound.playClick();
                        navigate(`/quiz/${fullData.id}`);
                    }}
                    data-testid="chapter-next-btn"
                >
                    <span>{t("next")} (5 Soal)</span>
                    <ArrowRight className="size-4" />
                </PixelButton>
            </div>

            {/* Chapter Completion Celebration Modal */}
            <Dialog open={celebrateOpen} onOpenChange={setCelebrateOpen}>
                <DialogContent className="border-2 border-quantum bg-panel text-center" data-testid="celebrate-dialog">
                    <DialogHeader>
                        <Trophy className="mx-auto size-14 text-chip glow-quantum" />
                        <DialogTitle className="mt-3 font-heading text-2xl text-quantum">
                            {loc({ id: "Bab Berhasil Diselesaikan!", en: "Chapter Completed!" })}
                        </DialogTitle>
                        <DialogDescription className="font-mono text-sm leading-relaxed">
                            {loc({
                                id: `Hebat! Kamu telah menguasai ${loc(fullData.title)}. +50 XP dan catatan jurnal telah ditambahkan ke Buku Lab. Bab berikutnya kini terbuka!`,
                                en: `Outstanding! You mastered ${loc(fullData.title)}. +50 XP and a research note have been logged. Next chapter unlocked!`,
                            })}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="my-4 border border-border p-3 font-mono text-xs text-muted-foreground bg-locked">
                        <span className="font-pixel text-[8px] text-quantum block mb-1">PERSAMAAN TERBUKA:</span>
                        <Tex math={fullData.formula} block />
                    </div>

                    <DialogFooter className="flex justify-center sm:justify-center">
                        <PixelButton
                            variant="primary"
                            onClick={() => {
                                setCelebrateOpen(false);
                                navigate(`/quiz/${fullData.id}`);
                            }}
                            data-testid="celebrate-continue-btn"
                        >
                            <Sparkles className="size-4" />
                            <span>{loc({ id: "Lanjut ke Ujian Kuis", en: "Proceed to Quiz Deck" })}</span>
                        </PixelButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ==========================================
// 4. QUIZ SCREEN (5 QUESTIONS PER CHAPTER WITH DETAILED FEEDBACK)
// ==========================================
const LETTERS = ["A", "B", "C", "D"];

export function Quiz() {
    const t = useT("quiz");
    const loc = useLocalized();
    const navigate = useNavigate();
    const { id } = useParams();
    const chapterId = Number(id) || 1;
    const ch = getChapterFull(chapterId);
    const questions = ch?.quiz || [];
    const total = questions.length;

    const addXp = useGameStore((s) => s.addXp);
    const completeChapter = useGameStore((s) => s.completeChapter);
    const soundEnabled = useGameStore((s) => s.soundEnabled);

    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(() => Array(total).fill(null));
    const [done, setDone] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    const q = questions[step] || questions[0];
    const selected = answers[step];
    const score = answers.filter((a, i) => a === questions[i]?.answer).length;

    const choose = (opt: number) => {
        setAnswers((prev) => prev.map((a, i) => (i === step ? opt : a)));
        setShowExplanation(true);
        if (soundEnabled) {
            if (opt === q.answer) sound.playCorrect();
            else sound.playWrong();
        }
    };

    const reset = () => {
        setAnswers(Array(total).fill(null));
        setStep(0);
        setDone(false);
        setShowExplanation(false);
        if (soundEnabled) sound.playClick();
    };

    const submitQuiz = () => {
        setDone(true);
        // Award XP: +20 XP per correct question
        const gainedXp = score * 20;
        addXp(gainedXp);
        if (score >= 3) {
            completeChapter(chapterId);
        }
        if (soundEnabled) {
            if (score >= 3) sound.playFanfare();
            else sound.playWrong();
        }
    };

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-6" data-testid="quiz-container">
            <div>
                <Link to={`/chapter/${chapterId}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-quantum" data-testid="quiz-back-link">
                    <ArrowLeft className="size-4" /> {t("backToChapter")}
                </Link>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    {ch && <PixelTag tone="chip">{ch.code}</PixelTag>}
                    <PixelTag tone="energy">5-DECK ASSESSMENT</PixelTag>
                </div>
                <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl" data-testid="quiz-title">
                    {t("title", { n: chapterId })}
                </h1>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {loc({ id: "Setiap jawaban benar bernilai +20 XP. Selesaikan minimal 3/5 untuk membuka bab berikutnya.", en: "Each correct answer awards +20 XP. Pass 3/5 to unlock next chapter." })}
                </p>
            </div>

            {/* Stepper Meter */}
            <div className="flex gap-1.5" data-testid="quiz-step-meter">
                {questions.map((qq, i) => (
                    <button
                        key={qq.id}
                        type="button"
                        disabled={done}
                        onClick={() => {
                            setStep(i);
                            setShowExplanation(answers[i] !== null);
                            if (soundEnabled) sound.playClick();
                        }}
                        aria-label={t("question", { i: i + 1, total })}
                        data-testid={`quiz-step-${i + 1}`}
                        className={cn(
                            "h-3 flex-1 border transition-colors duration-150 cursor-pointer",
                            i === step && !done ? "border-quantum bg-quantum" : answers[i] !== null ? "border-quantum/50 bg-quantum/30" : "border-border bg-locked",
                        )}
                    />
                ))}
            </div>

            <AnimatePresence mode="wait">
                {done ? (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                        <PixelPanel tone="quantum" className="p-8 text-center" data-testid="quiz-result">
                            <Trophy className="mx-auto size-12 text-chip glow-quantum" />
                            <h2 className="mt-4 font-heading text-2xl font-bold">{t("resultTitle")}</h2>
                            <p className="mt-3 font-pixel text-4xl text-quantum" data-testid="quiz-score">
                                {score}/{total}
                            </p>
                            <p className="mt-3 font-mono text-sm text-muted-foreground">{t("resultBody", { score, total })}</p>
                            <div className="mt-2 font-pixel text-[10px] text-chip">
                                +{score * 20} XP GAINED
                            </div>

                            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                                <PixelButton variant="outline" onClick={reset} data-testid="quiz-retry-btn">
                                    <RotateCcw /> {t("retry")}
                                </PixelButton>
                                {chapterId < TOTAL_CHAPTERS && score >= 3 ? (
                                    <PixelButton onClick={() => navigate(`/chapter/${chapterId + 1}`)} data-testid="next-chapter-btn">
                                        <span>{loc({ id: "Bab Berikutnya", en: "Next Chapter" })}</span>
                                        <ArrowRight />
                                    </PixelButton>
                                ) : (
                                    <Link to="/map" className={pixelButton()} data-testid="quiz-back-to-chapter-btn">
                                        {loc({ id: "Peta Petualangan", en: "Adventure Map" })}
                                    </Link>
                                )}
                            </div>
                        </PixelPanel>
                    </motion.div>
                ) : (
                    <motion.div key={q.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}>
                        <PixelPanel
                            label={t("question", { i: step + 1, total })}
                            labelRight={<span className="font-mono text-[11px] text-muted-foreground">{t("selectHint")}</span>}
                            data-testid="quiz-question-panel"
                        >
                            <div className="p-5 sm:p-6">
                                <p className="font-heading text-lg font-semibold leading-snug sm:text-xl" data-testid="quiz-prompt">
                                    {loc(q.prompt)}
                                </p>
                                {q.formula && (
                                    <div className="mt-3 text-quantum overflow-x-auto">
                                        <Tex math={q.formula} block />
                                    </div>
                                )}
                                <div className="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup">
                                    {q.options.map((opt, i) => {
                                        const active = selected === i;
                                        const isCorrect = i === q.answer;
                                        const showResultColor = selected !== null;

                                        return (
                                            <button
                                                key={i}
                                                type="button"
                                                role="radio"
                                                aria-checked={active}
                                                onClick={() => choose(i)}
                                                data-testid={`quiz-option-${i}`}
                                                className={cn(
                                                    "flex items-center gap-3 border-2 p-3.5 text-left text-sm transition-[transform,border-color,box-shadow,background-color] duration-150 cursor-pointer",
                                                    active
                                                        ? isCorrect
                                                            ? "border-success bg-success/15 shadow-[3px_3px_0_0_var(--success)]"
                                                            : "border-destructive bg-destructive/15 shadow-[3px_3px_0_0_var(--destructive)]"
                                                        : showResultColor && isCorrect
                                                            ? "border-success/60 bg-success/5"
                                                            : "border-border bg-panel-raised hover:-translate-y-0.5 hover:border-quantum/60",
                                                )}
                                            >
                                                <span className={cn(
                                                    "grid size-7 shrink-0 place-items-center border font-pixel text-[9px]",
                                                    active
                                                        ? isCorrect ? "border-success bg-success text-background" : "border-destructive bg-destructive text-white"
                                                        : "border-border text-muted-foreground",
                                                )}>
                                                    {LETTERS[i]}
                                                </span>
                                                <span className="font-mono">{loc(opt)}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Explanatory Feedback Box */}
                                {showExplanation && selected !== null && (
                                    <div
                                        className={cn(
                                            "mt-5 border-2 p-4 font-mono text-xs leading-relaxed",
                                            selected === q.answer
                                                ? "border-success/60 bg-success/10 text-foreground"
                                                : "border-destructive/60 bg-destructive/10 text-foreground",
                                        )}
                                        data-testid="quiz-explanation-box"
                                    >
                                        <span className="font-pixel text-[8px] uppercase tracking-wider block mb-1">
                                            {selected === q.answer ? "✓ JAWABAN TEPAT!" : "✕ PENJELASAN KONSEP:"}
                                        </span>
                                        <p>{loc(q.explanation)}</p>
                                    </div>
                                )}
                            </div>
                        </PixelPanel>
                    </motion.div>
                )}
            </AnimatePresence>

            {!done && (
                <div className="flex gap-3">
                    <PixelButton
                        variant="ghost"
                        disabled={step === 0}
                        onClick={() => {
                            setStep((s) => s - 1);
                            setShowExplanation(answers[step - 1] !== null);
                            if (soundEnabled) sound.playClick();
                        }}
                        data-testid="quiz-prev-btn"
                    >
                        <ArrowLeft /> <span className="hidden sm:inline">{t("prev")}</span>
                    </PixelButton>
                    {step < total - 1 ? (
                        <PixelButton
                            className="ml-auto"
                            disabled={selected === null}
                            onClick={() => {
                                setStep((s) => s + 1);
                                setShowExplanation(answers[step + 1] !== null);
                                if (soundEnabled) sound.playClick();
                            }}
                            data-testid="quiz-next-btn"
                        >
                            {t("next")} <ArrowRight />
                        </PixelButton>
                    ) : (
                        <PixelButton
                            className="ml-auto"
                            disabled={answers.some((a) => a === null)}
                            onClick={submitQuiz}
                            data-testid="quiz-submit-btn"
                        >
                            <Send /> {t("submit")}
                        </PixelButton>
                    )}
                </div>
            )}
        </div>
    );
}

// ==========================================
// 5. LAB NOTEBOOK / JOURNAL SCREEN
// ==========================================
export function Journal() {
    const t = useT("journal");
    const loc = useLocalized();
    const lang = useLang();
    const entries = useGameStore((s) => s.journalEntries);
    const badges = useGameStore((s) => s.badges);
    const soundEnabled = useGameStore((s) => s.soundEnabled);
    const [q, setQ] = useState("");

    const filtered = useMemo(() => {
        const needle = q.trim().toLowerCase();
        if (!needle) return entries;
        return entries.filter((e) => `${loc(e.title)} ${loc(e.note)}`.toLowerCase().includes(needle));
    }, [entries, q, loc]);

    const handleExport = () => {
        const text = exportJournalAsText(entries, lang);
        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `QuantumLab_Journal_${new Date().toISOString().slice(0, 10)}.txt`;
        link.click();
        URL.revokeObjectURL(url);
        if (soundEnabled) sound.playLevelUp();
        toast.success(loc({ id: "Jurnal berhasil diekspor sebagai file .txt", en: "Journal exported successfully as .txt" }));
    };

    return (
        <div className="flex flex-col gap-8" data-testid="journal-container">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl" data-testid="journal-title">
                        {t("title")}
                    </h1>
                    <p className="mt-2 font-mono text-sm text-muted-foreground">{t("subtitle")}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative w-full sm:w-64">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder={t("search")}
                            className="h-11 rounded-none border-2 bg-panel pl-9 font-mono text-sm"
                            data-testid="journal-search-input"
                        />
                    </div>
                    <PixelButton variant="chip" onClick={handleExport} data-testid="export-journal-btn">
                        <Download className="size-4" />
                        <span>{loc({ id: "Ekspor Jurnal (.txt)", en: "Export Journal (.txt)" })}</span>
                    </PixelButton>
                </div>
            </div>

            {/* Badges Showcase Strip */}
            <PixelPanel label={t("badgesTitle")} tone="chip" data-testid="journal-badges">
                <div className="flex flex-wrap gap-3 p-4">
                    {badges.length === 0 ? (
                        <p className="font-mono text-sm text-muted-foreground">{t("noBadges")}</p>
                    ) : (
                        badges.map((b) => {
                            const def = BADGE_DEFINITIONS[b];
                            return (
                                <div
                                    key={b}
                                    className="flex items-center gap-2 border-2 border-chip/60 bg-chip/10 px-3 py-2 text-sm font-semibold text-chip"
                                    data-testid={`badge-${b}`}
                                    title={def ? loc(def.desc) : b}
                                >
                                    <Award className="size-4" />
                                    <span>{def ? loc(def.name) : b}</span>
                                </div>
                            );
                        })
                    )}
                </div>
            </PixelPanel>

            {/* Discoveries Log Cards */}
            <div>
                <p className="mb-4 font-pixel text-[9px] tracking-widest text-muted-foreground" data-testid="journal-count">
                    {t("entries", { n: filtered.length })}
                </p>
                {filtered.length === 0 ? (
                    <PixelPanel className="p-10 text-center" data-testid="journal-empty">
                        <BookOpen className="mx-auto size-10 text-muted-foreground" />
                        <p className="mx-auto mt-4 max-w-sm font-mono text-sm text-muted-foreground">{t("empty")}</p>
                    </PixelPanel>
                ) : (
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="journal-list">
                        {filtered.map((e, i) => {
                            return (
                                <li
                                    key={e.id}
                                    className={`group relative flex flex-col border-2 border-border bg-panel p-5 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-quantum hover:shadow-[4px_4px_0_0_var(--quantum)] ${i === 0 ? "lg:col-span-2" : ""}`}
                                    data-testid={`journal-entry-${e.id}`}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <PixelTag tone="quantum">{`CH-${String(e.chapterId).padStart(2, "0")}`}</PixelTag>
                                        <span className="font-mono text-[11px] text-muted-foreground">
                                            {format(new Date(e.discoveredAt), "d MMM yyyy", { locale: lang === "id" ? idLocale : enUS })}
                                        </span>
                                    </div>
                                    <h3 className="mt-3 font-heading text-lg font-semibold tracking-tight">{loc(e.title)}</h3>
                                    <p className="mt-2 flex-1 font-mono text-[13px] leading-relaxed text-muted-foreground">{loc(e.note)}</p>
                                    {e.formula && (
                                        <div className="mt-4 overflow-x-auto border-t-2 border-dashed border-border pt-3 text-chip">
                                            <Tex math={e.formula} />
                                        </div>
                                    )}
                                    <p className="mt-3 font-mono text-[11px] text-muted-foreground">{t("from", { n: e.chapterId })}</p>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}

// ==========================================
// 6. SETTINGS SCREEN
// ==========================================
function SettingRow({ icon, title, hint, children, testid }: { icon: ReactNode; title: string; hint: string; children: ReactNode; testid: string }) {
    return (
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between" data-testid={testid}>
            <div className="flex items-start gap-3">
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center border-2 border-border text-quantum">{icon}</span>
                <div>
                    <p className="font-heading font-semibold">{title}</p>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">{hint}</p>
                </div>
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    );
}

export function Settings() {
    const t = useT("settings");
    const loc = useLocalized();
    const theme = useGameStore((s) => s.theme);
    const setTheme = useGameStore((s) => s.setTheme);
    const soundEnabled = useGameStore((s) => s.soundEnabled);
    const toggleSound = useGameStore((s) => s.toggleSound);
    const resetProgress = useGameStore((s) => s.resetProgress);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const dark = theme === "dark";

    const doReset = () => {
        resetProgress();
        setConfirmOpen(false);
        if (soundEnabled) sound.playClick();
        toast.success(t("resetDone"));
    };

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-6" data-testid="settings-container">
            <div>
                <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl" data-testid="settings-title">
                    {t("title")}
                </h1>
                <p className="mt-2 font-mono text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>

            <PixelPanel label="SYS.CONFIG" className="divide-y-2 divide-border">
                <SettingRow icon={<Languages className="size-4" />} title={t("language")} hint={t("languageHint")} testid="settings-language-row">
                    <LangToggle size="md" />
                </SettingRow>

                {/* Sound Effects Toggle */}
                <SettingRow
                    icon={soundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                    title={loc({ id: "Efek Suara 8-Bit", en: "8-Bit Sound FX" })}
                    hint={loc({ id: "Suara retro sintesis prosedural Web Audio API.", en: "Procedural retro synthesized Web Audio effects." })}
                    testid="settings-sound-row"
                >
                    <button
                        type="button"
                        role="switch"
                        aria-checked={soundEnabled}
                        onClick={() => {
                            toggleSound();
                            if (!soundEnabled) sound.playLevelUp();
                        }}
                        data-testid="settings-sound-toggle"
                        className={cn(
                            "relative flex h-10 w-24 items-center border-2 p-1 transition-colors duration-200 cursor-pointer",
                            soundEnabled ? "border-quantum bg-quantum/10" : "border-border bg-locked",
                        )}
                    >
                        <span
                            className={cn(
                                "grid h-full w-1/2 place-items-center font-pixel text-[8px] transition-[transform,background-color] duration-200",
                                soundEnabled ? "translate-x-full bg-quantum text-on-quantum" : "translate-x-0 bg-muted-foreground text-background",
                            )}
                        >
                            {soundEnabled ? t("on") : t("off")}
                        </span>
                    </button>
                </SettingRow>

                <SettingRow icon={<Moon className="size-4" />} title={t("theme")} hint={t("themeHint")} testid="settings-theme-row">
                    <button
                        type="button"
                        role="switch"
                        aria-checked={dark}
                        onClick={() => {
                            setTheme(dark ? "light" : "dark");
                            if (soundEnabled) sound.playClick();
                        }}
                        data-testid="settings-dark-mode-toggle"
                        className={cn(
                            "relative flex h-10 w-24 items-center border-2 p-1 transition-colors duration-200 cursor-pointer",
                            dark ? "border-quantum bg-quantum/10" : "border-border bg-locked",
                        )}
                    >
                        <span
                            className={cn(
                                "grid h-full w-1/2 place-items-center font-pixel text-[8px] transition-[transform,background-color] duration-200",
                                dark ? "translate-x-full bg-quantum text-on-quantum" : "translate-x-0 bg-muted-foreground text-background",
                            )}
                        >
                            {dark ? t("on") : t("off")}
                        </span>
                    </button>
                </SettingRow>

                <SettingRow icon={<RotateCcw className="size-4" />} title={t("reset")} hint={t("resetHint")} testid="settings-reset-row">
                    <PixelButton
                        variant="danger"
                        size="sm"
                        onClick={() => {
                            setConfirmOpen(true);
                            if (soundEnabled) sound.playClick();
                        }}
                        data-testid="settings-reset-btn"
                    >
                        {t("resetButton")}
                    </PixelButton>
                </SettingRow>
            </PixelPanel>

            <PixelPanel className="flex items-start gap-3 p-5" data-testid="settings-about">
                <Info className="mt-0.5 size-4 shrink-0 text-chip" />
                <div>
                    <p className="font-heading font-semibold">{t("about")}</p>
                    <p className="mt-1 font-mono text-xs text-muted-foreground leading-relaxed">
                        Quantum Lab v1.0 · Full 13-Chapter Interactive Curriculum · Silicon Chip Physics Sandbox · Bilingual Indonesian / English.
                    </p>
                </div>
            </PixelPanel>

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="rounded-none border-2 border-destructive bg-panel" data-testid="reset-confirm-dialog">
                    <DialogHeader>
                        <DialogTitle className="font-heading text-xl">{t("resetConfirmTitle")}</DialogTitle>
                        <DialogDescription className="font-mono text-sm">{t("resetConfirmBody")}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3 border-0 bg-transparent">
                        <PixelButton variant="ghost" onClick={() => setConfirmOpen(false)} data-testid="reset-cancel-btn">
                            {t("cancel")}
                        </PixelButton>
                        <PixelButton variant="danger" onClick={doReset} data-testid="reset-confirm-btn">
                            {t("confirm")}
                        </PixelButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default {
    Home,
    AdventureMap,
    ChapterView,
    Quiz,
    Journal,
    Settings,
};
