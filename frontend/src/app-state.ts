import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useCallback } from "react";
import { translations } from "./translations";
import { CURRICULUM, getChapterFull } from "./curriculum";

// --- Language & Localization Types ---
export type Lang = "id" | "en";
export const LANGS: Lang[] = ["id", "en"];
export type Bilingual = { id: string; en: string };

// --- Chapter Types & Registry ---
export type Era =
    | "quantum_birth"
    | "wave_matter"
    | "wave_mechanics"
    | "quantum_tunneling"
    | "solid_state"
    | "semiconductors"
    | "chip_design";

export interface ChapterMeta {
    id: number;
    code: string;
    era: Era;
    title: Bilingual;
    formula: string;
}

export const CHAPTERS: ChapterMeta[] = CURRICULUM.map((c) => ({
    id: c.id,
    code: c.code,
    era: c.era,
    title: c.title,
    formula: c.formula,
}));

export const getChapter = (id: number) => CHAPTERS.find((c) => c.id === id);
export const ERA_COUNT = new Set(CHAPTERS.map((c) => c.era)).size;
export const TOTAL_CHAPTERS = 13;

// --- Quiz Types & Sample Data ---
export interface QuizQuestion {
    id: string;
    prompt: Bilingual;
    formula?: string;
    options: Bilingual[];
    answer: number;
    explanation?: Bilingual;
}

export const SAMPLE_QUIZ: QuizQuestion[] = CURRICULUM[0].quiz;

// --- Journal & Progress State ---
export interface JournalEntry {
    id: string;
    chapterId: number;
    title: Bilingual;
    note: Bilingual;
    formula?: string;
    discoveredAt: string;
}

export type Theme = "dark" | "light";

export interface GameState {
    language: Lang;
    theme: Theme;
    soundEnabled: boolean;
    currentChapter: number;
    unlockedChapters: number[];
    completedChapters: number[];
    xp: number;
    badges: string[];
    journalEntries: JournalEntry[];
}

export interface GameActions {
    setLanguage: (lang: Lang) => void;
    setTheme: (theme: Theme) => void;
    setSoundEnabled: (enabled: boolean) => void;
    toggleSound: () => void;
    setCurrentChapter: (id: number) => void;
    unlockChapter: (id: number) => void;
    completeChapter: (id: number) => void;
    addXp: (amount: number) => void;
    awardBadge: (badgeId: string) => void;
    addJournalEntry: (entry: JournalEntry) => void;
    resetProgress: () => void;
}

// Milestone badges definition
export const BADGE_DEFINITIONS: Record<string, { id: string; name: Bilingual; desc: Bilingual; icon: string }> = {
    "first-quantum": {
        id: "first-quantum",
        name: { id: "Kuantum Pertama", en: "First Quantum" },
        desc: { id: "Menyelesaikan Bab 1: Kuantisasi Energi Planck", en: "Completed Chapter 1: Planck's Energy Quantization" },
        icon: "zap",
    },
    "wave-master": {
        id: "wave-master",
        name: { id: "Pawang Gelombang", en: "Wave Master" },
        desc: { id: "Menyelesaikan Bab 4: Gelombang Materi de Broglie", en: "Completed Chapter 4: de Broglie Matter Waves" },
        icon: "activity",
    },
    "tunneling-pioneer": {
        id: "tunneling-pioneer",
        name: { id: "Penerobos Kuantum", en: "Tunneling Pioneer" },
        desc: { id: "Menyelesaikan Bab 6: Penerowongan Menembus Rintangan", en: "Completed Chapter 6: Quantum Barrier Tunneling" },
        icon: "unlock",
    },
    "silicon-alchemist": {
        id: "silicon-alchemist",
        name: { id: "Alkemis Silikon", en: "Silicon Alchemist" },
        desc: { id: "Menyelesaikan Bab 8: Doping Semikonduktor Tipe P/N", en: "Completed Chapter 8: P/N-Type Doping" },
        icon: "flask-conical",
    },
    "transistor-architect": {
        id: "transistor-architect",
        name: { id: "Arsitek Transistor", en: "Transistor Architect" },
        desc: { id: "Menyelesaikan Bab 10: Sakelar Kuantum MOSFET", en: "Completed Chapter 10: MOSFET Transistor Switch" },
        icon: "cpu",
    },
    "lithography-master": {
        id: "lithography-master",
        name: { id: "Empu Fotolitografi", en: "Lithography Master" },
        desc: { id: "Menyelesaikan Bab 11: Pencetakan Nanometer EUV", en: "Completed Chapter 11: EUV Nanopatterning" },
        icon: "sun",
    },
    "chip-titan": {
        id: "chip-titan",
        name: { id: "Titan Semikonduktor", en: "Chip Titan" },
        desc: { id: "Menyelesaikan Bab 13: Capstone Desain Chip 2 nm", en: "Completed Chapter 13: 2 nm Chip Design Capstone" },
        icon: "trophy",
    },
};

const initialProgress: Omit<GameState, "language" | "theme" | "soundEnabled"> = {
    currentChapter: 1,
    unlockedChapters: [1],
    completedChapters: [],
    xp: 0,
    badges: [],
    journalEntries: [CURRICULUM[0].journalEntry],
};

export const useGameStore = create<GameState & GameActions>()(
    persist(
        (set, get) => ({
            language: "id",
            theme: "dark",
            soundEnabled: false, // Mute by default as requested
            ...initialProgress,
            setLanguage: (language) => set({ language }),
            setTheme: (theme) => set({ theme }),
            setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
            toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
            setCurrentChapter: (currentChapter) => set({ currentChapter }),
            unlockChapter: (id) =>
                set((s) =>
                    s.unlockedChapters.includes(id)
                        ? s
                        : { unlockedChapters: [...s.unlockedChapters, id].sort((a, b) => a - b) },
                ),
            completeChapter: (id) => {
                const state = get();
                const newCompleted = state.completedChapters.includes(id)
                    ? state.completedChapters
                    : [...state.completedChapters, id].sort((a, b) => a - b);

                // Strictly linear unlock: next chapter unlocks when current chapter completes
                const nextId = id + 1;
                const newUnlocked = (nextId <= TOTAL_CHAPTERS && !state.unlockedChapters.includes(nextId))
                    ? [...state.unlockedChapters, nextId].sort((a, b) => a - b)
                    : state.unlockedChapters;

                // Award XP (+50 XP for chapter completion)
                const newXp = state.completedChapters.includes(id) ? state.xp : state.xp + 50;

                // Auto add chapter journal discovery
                const chData = getChapterFull(id);
                let newJournal = state.journalEntries;
                if (chData && !newJournal.some((j) => j.chapterId === id)) {
                    newJournal = [...newJournal, chData.journalEntry];
                }

                // Check milestone badges
                const newBadges = [...state.badges];
                if (id >= 1 && !newBadges.includes("first-quantum")) newBadges.push("first-quantum");
                if (id >= 4 && !newBadges.includes("wave-master")) newBadges.push("wave-master");
                if (id >= 6 && !newBadges.includes("tunneling-pioneer")) newBadges.push("tunneling-pioneer");
                if (id >= 8 && !newBadges.includes("silicon-alchemist")) newBadges.push("silicon-alchemist");
                if (id >= 10 && !newBadges.includes("transistor-architect")) newBadges.push("transistor-architect");
                if (id >= 11 && !newBadges.includes("lithography-master")) newBadges.push("lithography-master");
                if (id >= 13 && !newBadges.includes("chip-titan")) newBadges.push("chip-titan");

                set({
                    completedChapters: newCompleted,
                    unlockedChapters: newUnlocked,
                    xp: newXp,
                    journalEntries: newJournal,
                    badges: newBadges,
                });
            },
            addXp: (amount) => set((s) => ({ xp: s.xp + amount })),
            awardBadge: (badgeId) =>
                set((s) => (s.badges.includes(badgeId) ? s : { badges: [...s.badges, badgeId] })),
            addJournalEntry: (entry) =>
                set((s) =>
                    s.journalEntries.some((e) => e.id === entry.id)
                        ? s
                        : { journalEntries: [...s.journalEntries, entry] },
                ),
            resetProgress: () => set({ ...initialProgress }),
        }),
        {
            name: "quantum_lab_save",
            version: 2,
            storage: createJSONStorage(() => localStorage),
        },
    ),
);

export const levelFromXp = (xp: number) => Math.floor(xp / 200) + 1;
export const xpIntoLevel = (xp: number) => xp % 200;

// --- i18n Translation & Hooks ---
type Vars = Record<string, string | number>;

function lookup(dict: unknown, path: string): unknown {
    return path.split(".").reduce<unknown>((acc, k) => {
        if (acc && typeof acc === "object" && k in (acc as Record<string, unknown>)) {
            return (acc as Record<string, unknown>)[k];
        }
        return undefined;
    }, dict);
}

export function translate(lang: Lang, key: string, vars?: Vars): string {
    const raw = lookup(translations[lang], key) ?? lookup(translations.id, key);
    if (typeof raw !== "string") return key;
    if (!vars) return raw;
    return raw.replace(/\{(\w+)\}/g, (_, v: string) => String(vars[v] ?? `{${v}}`));
}

export function useT(namespace?: string) {
    const lang = useGameStore((s) => s.language);
    return useCallback(
        (key: string, vars?: Vars) => translate(lang, namespace ? `${namespace}.${key}` : key, vars),
        [lang, namespace],
    );
}

export function useLang(): Lang {
    return useGameStore((s) => s.language);
}

export function useLocalized() {
    const lang = useLang();
    return useCallback((b: { id: string; en: string }) => b[lang] || b.en || b.id, [lang]);
}

// Helper to export journal as formatted text file
export function exportJournalAsText(entries: JournalEntry[], lang: Lang): string {
    const divider = "=================================================================\n";
    let text = `QUANTUM LAB: NOTEBOOK PENEMUAN & JURNAL RISET\n`;
    text += `Tanggal Ekspor: ${new Date().toLocaleString()}\n`;
    text += `Total Penemuan: ${entries.length} Catatan Riset Kuantum\n`;
    text += divider;

    entries.forEach((e, idx) => {
        text += `\n[ENTRY #${String(idx + 1).padStart(2, "0")}] BAB ${e.chapterId}: ${e.title[lang] || e.title.id}\n`;
        text += `Waktu: ${new Date(e.discoveredAt).toLocaleDateString()}\n`;
        if (e.formula) text += `Persamaan Kunci: ${e.formula}\n`;
        text += `Catatan: ${e.note[lang] || e.note.id}\n`;
        text += "-----------------------------------------------------------------\n";
    });

    return text;
}
