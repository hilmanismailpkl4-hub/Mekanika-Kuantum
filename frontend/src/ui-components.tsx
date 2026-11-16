import { forwardRef, useMemo, useEffect } from "react";
import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import katex from "katex";
import { useGameStore, LANGS } from "./app-state";

// --- Class Names Utility (cn) ---
export type ClassValue = string | number | boolean | undefined | null | { [key: string]: unknown } | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
    const classes: string[] = [];
    for (const input of inputs) {
        if (!input) continue;
        if (typeof input === "string" || typeof input === "number") {
            classes.push(String(input));
        } else if (Array.isArray(input)) {
            const inner = cn(...input);
            if (inner) classes.push(inner);
        } else if (typeof input === "object") {
            for (const [key, value] of Object.entries(input)) {
                if (value) classes.push(key);
            }
        }
    }
    return classes.join(" ");
}

// --- Pixel Atom SVG Sprite ---
const ORBIT = [
    [6, 1], [7, 1], [8, 1], [9, 1], [4, 2], [5, 2], [10, 2], [11, 2], [3, 3], [12, 3],
    [2, 4], [13, 4], [2, 5], [13, 5], [1, 6], [14, 6], [1, 7], [14, 7], [1, 8], [14, 8], [1, 9], [14, 9],
    [2, 10], [13, 10], [2, 11], [13, 11], [3, 12], [12, 12], [4, 13], [5, 13], [10, 13], [11, 13],
    [6, 14], [7, 14], [8, 14], [9, 14],
];
const NUCLEUS = [
    [7, 6], [8, 6], [6, 7], [7, 7], [8, 7], [9, 7], [6, 8], [7, 8], [8, 8], [9, 8], [7, 9], [8, 9],
];

export function PixelAtom({ className, size = 48 }: { className?: string; size?: number }) {
    return (
        <svg
            viewBox="0 0 16 16"
            width={size}
            height={size}
            shapeRendering="crispEdges"
            className={cn("glow-quantum", className)}
            aria-hidden
        >
            {ORBIT.map(([x, y]) => (
                <rect key={`o${x}-${y}`} x={x} y={y} width="1" height="1" fill="var(--quantum, #00F5D4)" opacity="0.85" />
            ))}
            {NUCLEUS.map(([x, y]) => (
                <rect key={`n${x}-${y}`} x={x} y={y} width="1" height="1" fill="var(--chip, #F59E0B)" />
            ))}
            <rect x="12" y="3" width="2" height="2" fill="var(--energy, #A855F7)" />
            <rect x="2" y="11" width="2" height="2" fill="var(--wave, #38BDF8)" />
        </svg>
    );
}

// --- Pixel Button (Neo-Pixel Style) ---
export type ButtonVariant = "primary" | "outline" | "chip" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "border-quantum bg-quantum text-on-quantum shadow-[4px_4px_0_0_var(--foreground,#000)] dark:shadow-[4px_4px_0_0_#ffffff22] " +
        "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--foreground,#000)] dark:hover:shadow-[2px_2px_0_0_#ffffff22] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
    outline:
        "border-quantum bg-panel text-quantum pixel-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--quantum,#00F5D4)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
    chip:
        "border-chip bg-panel text-chip pixel-shadow-chip hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--chip,#F59E0B)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
    ghost:
        "border-border bg-panel text-foreground pixel-shadow-muted hover:border-quantum hover:text-quantum hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
    danger:
        "border-destructive bg-destructive/10 text-destructive shadow-[3px_3px_0_0_var(--destructive,#EF4444)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--destructive,#EF4444)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-14 px-7 text-base",
    icon: "size-10 p-0",
};

export function pixelButton(options?: { variant?: ButtonVariant; size?: ButtonSize; className?: string }) {
    const variant = options?.variant ?? "primary";
    const size = options?.size ?? "md";
    return cn(
        "inline-flex select-none items-center justify-center gap-2 border-2 font-semibold tracking-tight whitespace-nowrap cursor-pointer " +
        "transition-[transform,box-shadow,background-color,color] duration-150 ease-out " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quantum focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
        "disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0",
        variantClasses[variant],
        sizeClasses[size],
        options?.className,
    );
}

export interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}

export const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
    ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => (
        <button ref={ref} type={type} className={pixelButton({ variant, size, className })} {...props} />
    ),
);
PixelButton.displayName = "PixelButton";

// --- Pixel Panel & Tag ---
export type PanelTone = "default" | "quantum" | "chip" | "sim";

const toneClass: Record<PanelTone, string> = {
    default: "border-border bg-panel",
    quantum: "border-quantum/60 bg-panel",
    chip: "border-chip/60 bg-panel",
    sim: "border-border bg-sim bg-lab-grid",
};

export interface PixelPanelProps extends HTMLAttributes<HTMLDivElement> {
    tone?: PanelTone;
    label?: ReactNode;
    labelRight?: ReactNode;
}

export function PixelPanel({ tone = "default", label, labelRight, className, children, ...props }: PixelPanelProps) {
    return (
        <div className={cn("relative border-2", toneClass[tone], className)} {...props}>
            {(label || labelRight) && (
                <div className="flex items-center justify-between gap-3 border-b-2 border-inherit px-4 py-2">
                    {label && (
                        <span className="flex items-center gap-2 font-pixel text-[9px] uppercase tracking-widest text-muted-foreground">
                            <span className="inline-block size-2 bg-quantum" aria-hidden />
                            {label}
                        </span>
                    )}
                    {labelRight}
                </div>
            )}
            {children}
        </div>
    );
}

export type TagTone = "muted" | "quantum" | "chip" | "energy" | "success";

const tagTones: Record<TagTone, string> = {
    muted: "border-border text-muted-foreground",
    quantum: "border-quantum/70 text-quantum",
    chip: "border-chip/70 text-chip",
    energy: "border-energy/70 text-energy",
    success: "border-success/70 text-success",
};

export function PixelTag({
    children,
    tone = "muted",
    className,
    ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: TagTone }) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 border px-1.5 py-1 font-pixel text-[8px] uppercase leading-none tracking-widest",
                tagTones[tone],
                className,
            )}
            {...props}
        >
            {children}
        </span>
    );
}

// --- Language Toggle Switch ---
export function LangToggle({ className, size = "sm" }: { className?: string; size?: "sm" | "md" }) {
    const language = useGameStore((s) => s.language);
    const setLanguage = useGameStore((s) => s.setLanguage);
    return (
        <div
            role="radiogroup"
            aria-label="Language"
            className={cn("inline-flex border-2 border-border bg-panel p-0.5", className)}
            data-testid="lang-toggle"
        >
            {LANGS.map((l) => {
                const active = l === language;
                return (
                    <button
                        key={l}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setLanguage(l)}
                        data-testid={`lang-toggle-${l}`}
                        className={cn(
                            "cursor-pointer font-pixel uppercase tracking-widest transition-[background-color,color] duration-150",
                            size === "sm" ? "px-2 py-1.5 text-[9px]" : "px-4 py-2.5 text-[11px]",
                            active ? "bg-quantum text-on-quantum" : "text-muted-foreground hover:text-foreground",
                        )}
                    >
                        {l}
                    </button>
                );
            })}
        </div>
    );
}

// --- KaTeX Mathematical Formula Renderer ---
export interface TexProps {
    math: string;
    block?: boolean;
    className?: string;
    "data-testid"?: string;
}

export function Tex({ math, block = false, className, ...rest }: TexProps) {
    const html = useMemo(() => {
        try {
            return katex.renderToString(math, { displayMode: block, throwOnError: false, output: "html" });
        } catch {
            return math;
        }
    }, [math, block]);
    const Tag = block ? "div" : "span";
    return <Tag className={cn(className)} dangerouslySetInnerHTML={{ __html: html }} data-testid={rest["data-testid"]} />;
}

// --- Input Component ---
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    ({ className, type = "text", ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full border-2 border-border bg-panel px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quantum disabled:cursor-not-allowed disabled:opacity-50",
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);
Input.displayName = "Input";

// --- Dialog Modal Components ---
interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) onOpenChange(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onOpenChange]);

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => onOpenChange(false)} aria-hidden />
            <div className="relative z-50 w-full max-w-lg">{children}</div>
        </div>
    );
}

export function DialogContent({ className, children, "data-testid": testid }: { className?: string; children: ReactNode; "data-testid"?: string }) {
    return (
        <div className={cn("border-2 border-border bg-panel p-6 shadow-2xl", className)} data-testid={testid}>
            {children}
        </div>
    );
}

export function DialogHeader({ className, children }: { className?: string; children: ReactNode }) {
    return <div className={cn("flex flex-col space-y-1.5 text-left", className)}>{children}</div>;
}

export function DialogTitle({ className, children }: { className?: string; children: ReactNode }) {
    return <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>{children}</h2>;
}

export function DialogDescription({ className, children }: { className?: string; children: ReactNode }) {
    return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
}

export function DialogFooter({ className, children }: { className?: string; children: ReactNode }) {
    return <div className={cn("mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}>{children}</div>;
}

// --- Sheet Drawer Components ---
interface SheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) onOpenChange(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onOpenChange]);

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => onOpenChange(false)} aria-hidden />
            <div className="relative z-50">{children}</div>
        </div>
    );
}

export function SheetContent({
    className,
    children,
    side = "bottom",
    "data-testid": testid,
}: {
    className?: string;
    children: ReactNode;
    side?: "top" | "bottom" | "left" | "right";
    "data-testid"?: string;
}) {
    const sideClass = {
        bottom: "fixed inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto",
        top: "fixed inset-x-0 top-0 max-h-[85vh] overflow-y-auto",
        left: "fixed inset-y-0 left-0 w-3/4 max-w-sm overflow-y-auto",
        right: "fixed inset-y-0 right-0 w-3/4 max-w-sm overflow-y-auto",
    }[side];

    return (
        <div className={cn("border-t-2 bg-panel p-6 shadow-2xl", sideClass, className)} data-testid={testid}>
            {children}
        </div>
    );
}

export function SheetHeader({ className, children }: { className?: string; children: ReactNode }) {
    return <div className={cn("flex flex-col space-y-2 text-left", className)}>{children}</div>;
}

export function SheetTitle({ className, children }: { className?: string; children: ReactNode }) {
    return <h2 className={cn("text-lg font-semibold text-foreground", className)}>{children}</h2>;
}

export function SheetDescription({ className, children }: { className?: string; children: ReactNode }) {
    return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
}

// --- Simple Toaster Notification Container ---
export function Toaster({ className }: { className?: string }) {
    return <div className={cn("pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2", className)} id="toaster" />;
}
