import type { ReactNode, CSSProperties } from "react";

type GlassCardProps = {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
};

export default function GlassCard({ children, className = "", style }: GlassCardProps) {
    return (
        <div
            className={`rounded-2xl border border-white/20 bg-black/10 backdrop-blur-md  shadow-lg text-white ${className}`}
            style={style}
        >
            {children}
        </div>
    );
}