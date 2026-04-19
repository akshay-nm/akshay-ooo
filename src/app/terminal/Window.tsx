"use client";

import { motion, useDragControls } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
	title: string;
	onClose: () => void;
	onFocus: () => void;
	z: number;
	initial: { x: number; y: number };
	children: ReactNode;
};

export function Window({
	title,
	onClose,
	onFocus,
	z,
	initial,
	children,
}: Props) {
	const controls = useDragControls();

	return (
		<motion.div
			drag
			dragListener={false}
			dragControls={controls}
			dragMomentum={false}
			initial={{ x: initial.x, y: initial.y }}
			onPointerDown={onFocus}
			style={{ zIndex: z }}
			className="panel pointer-events-auto absolute left-0 top-0 flex max-h-[70vh] w-[520px] max-w-[92vw] flex-col shadow-[0_0_60px_rgba(0,255,156,0.12)]"
		>
			<div
				onPointerDown={(e) => {
					controls.start(e);
				}}
				className="flex cursor-grab items-center justify-between border-b border-[var(--line)] px-3 py-2 active:cursor-grabbing"
			>
				<div className="flex select-none items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
					<span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent-glow)]" />
					{title}
				</div>
				<button
					onPointerDown={(e) => e.stopPropagation()}
					onClick={onClose}
					aria-label="close window"
					className="text-[var(--muted)] transition hover:text-[var(--accent)]"
				>
					<span className="text-sm leading-none">×</span>
				</button>
			</div>
			<div className="overflow-y-auto p-4 text-sm">{children}</div>
		</motion.div>
	);
}
