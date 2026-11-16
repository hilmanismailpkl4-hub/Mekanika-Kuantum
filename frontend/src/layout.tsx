import { useEffect } from "react";
import type { ReactNode } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Award, BookOpen, Home, Map, Settings as SettingsIcon, Zap, Volume2, VolumeX } from "lucide-react";
import { useGameStore, levelFromXp, xpIntoLevel, TOTAL_CHAPTERS, useT } from "./app-state";
import { cn, PixelAtom, LangToggle, Toaster } from "./ui-components";
import { sound } from "./sound";

export const NAV_ITEMS = [
    { to: "/", key: "home", icon: Home },
    { to: "/map", key: "map", icon: Map },
    { to: "/journal", key: "journal", icon: BookOpen },
    { to: "/settings", key: "settings", icon: SettingsIcon },
] as const;

/** Top HUD: brand, chapter progress, XP bar, badges, sound toggle, desktop nav, language switch. */
export function GameHUD() {
    const t = useT();
    const xp = useGameStore((s) => s.xp);
    const badges = useGameStore((s) => s.badges.length);
    const current = useGameStore((s) => s.currentChapter);
    const soundEnabled = useGameStore((s) => s.soundEnabled);
    const toggleSound = useGameStore((s) => s.toggleSound);
    const level = levelFromXp(xp);
    const pct = (xpIntoLevel(xp) / 200) * 100;

    return (
        <header
            className="sticky top-0 z-40 border-b-2 border-border bg-sidebar/85 backdrop-blur-md"
            data-testid="game-hud"
        >
            <div className="mx-auto flex h-14 max-w-6xl items-center gap-2.5 px-3 sm:h-16 sm:px-6">
                <Link to="/" className="flex shrink-0 items-center gap-2" data-testid="hud-brand-link">
                    <PixelAtom size={28} />
                    <span className="hidden font-heading text-base font-bold tracking-tight sm:inline">
                        Quantum<span className="text-quantum">Lab</span>
                    </span>
                </Link>

                <nav className="ml-3 hidden items-center gap-1 md:flex" aria-label="Main">
                    {NAV_ITEMS.slice(1).map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            data-testid={`hud-nav-${item.key}`}
                            className={({ isActive }) =>
                                cn(
                                    "px-3 py-2 text-sm font-medium transition-colors duration-150",
                                    isActive ? "text-quantum font-bold" : "text-muted-foreground hover:text-foreground",
                                )
                            }
                        >
                            {t(`nav.${item.key}`)}
                        </NavLink>
                    ))}
                </nav>

                <div className="ml-auto flex items-center gap-2 sm:gap-3">
                    <span
                        className="hidden border border-border px-2 py-1.5 font-pixel text-[9px] tracking-widest text-muted-foreground lg:inline"
                        data-testid="hud-chapter-progress"
                    >
                        CH {String(current).padStart(2, "0")}/{TOTAL_CHAPTERS}
                    </span>

                    {/* XP & Level Indicator */}
                    <div className="flex items-center gap-2" data-testid="hud-xp">
                        <span className="font-pixel text-[9px] text-chip">
                            {t("common.level")}
                            {level}
                        </span>
                        <div className="hidden w-20 flex-col gap-1 sm:flex">
                            <div className="h-2 border border-border bg-locked">
                                <div className="h-full bg-quantum transition-[width] duration-500" style={{ width: `${pct}%` }} />
                            </div>
                        </div>
                        <span className="flex items-center gap-1 font-pixel text-[9px] text-quantum" data-testid="hud-xp-value">
                            <Zap className="size-3" aria-hidden />
                            {xp}
                        </span>
                    </div>

                    {/* Badges Indicator */}
                    <Link
                        to="/journal"
                        className="flex items-center gap-1 border border-chip/50 px-1.5 py-1 font-pixel text-[9px] text-chip transition-colors hover:bg-chip/10"
                        data-testid="hud-badges"
                        aria-label={t("common.badges")}
                    >
                        <Award className="size-3" aria-hidden />
                        {badges}
                    </Link>

                    {/* Sound Mute/Unmute Toggle Button */}
                    <button
                        type="button"
                        onClick={() => {
                            toggleSound();
                            if (!soundEnabled) sound.playClick();
                        }}
                        className={cn(
                            "flex size-8 items-center justify-center border-2 transition-colors cursor-pointer",
                            soundEnabled
                                ? "border-quantum bg-quantum/10 text-quantum"
                                : "border-border bg-panel text-muted-foreground hover:text-foreground",
                        )}
                        data-testid="hud-sound-toggle-btn"
                        aria-label={soundEnabled ? "Mute audio" : "Unmute audio"}
                        title={soundEnabled ? "Audio Active (Click to mute)" : "Audio Muted (Click to enable)"}
                    >
                        {soundEnabled ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
                    </button>

                    <LangToggle />
                </div>
            </div>
        </header>
    );
}

/** Mobile bottom tab bar (hidden >= md). */
export function BottomNav() {
    const t = useT();
    return (
        <nav
            className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-border bg-sidebar/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
            aria-label="Mobile"
            data-testid="bottom-nav"
        >
            <div className="grid grid-cols-4">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/"}
                        data-testid={`bottom-nav-${item.key}`}
                        className={({ isActive }) =>
                            cn(
                                "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors duration-150",
                                isActive ? "text-quantum font-bold" : "text-muted-foreground",
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={cn("size-5", isActive && "glow-quantum")} aria-hidden />
                                {t(`nav.${item.key}`)}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}

/** Keeps <html> class + lang in sync with the persisted store. */
export function useDocumentSync() {
    const theme = useGameStore((s) => s.theme);
    const language = useGameStore((s) => s.language);
    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        document.documentElement.style.colorScheme = theme;
    }, [theme]);
    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);
}

/** App frame for in-game screens: HUD, animated page outlet, mobile tab bar. */
export default function GameLayout() {
    const { pathname } = useLocation();
    return (
        <div className="relative min-h-dvh bg-background bg-lab-grid">
            <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" aria-hidden />
            <GameHUD />
            <motion.main
                key={pathname}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative mx-auto max-w-6xl px-4 pt-6 pb-28 sm:px-6 sm:pt-10 md:pb-16"
            >
                <Outlet />
            </motion.main>
            <BottomNav />
        </div>
    );
}

export function RootProviders({ children }: { children: ReactNode }) {
    useDocumentSync();
    return (
        <>
            {children}
            <Toaster className="mb-16 md:mb-0" />
        </>
    );
}
