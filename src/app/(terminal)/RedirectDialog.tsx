"use client";

import { useEffect } from "react";

type Props = {
	href: string | null;
	onConfirm: () => void;
	onCancel: () => void;
};

export function RedirectDialog({ href, onConfirm, onCancel }: Props) {
	useEffect(() => {
		if (!href) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Enter") {
				e.preventDefault();
				e.stopPropagation();
				onConfirm();
			} else if (e.key === "Escape") {
				e.preventDefault();
				e.stopPropagation();
				onCancel();
			}
		};
		window.addEventListener("keydown", onKey, true);
		return () => window.removeEventListener("keydown", onKey, true);
	}, [href, onConfirm, onCancel]);

	if (!href) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
			onClick={onCancel}
		>
			<div
				className="panel w-full max-w-md space-y-3 p-5"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center gap-2">
					<span className="text-[var(--accent)] glow">!</span>
					<p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
						leaving terminal
					</p>
				</div>
				<div className="space-y-1 text-sm">
					<p className="text-[var(--muted)]">you&apos;re being redirected to:</p>
					<p className="break-all text-[var(--accent)]">{href}</p>
				</div>
				<div className="flex gap-2 pt-2">
					<button
						onClick={onConfirm}
						className="border border-[var(--accent)] px-3 py-1 text-sm text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-black"
					>
						[enter] proceed
					</button>
					<button
						onClick={onCancel}
						className="border border-[var(--line)] px-3 py-1 text-sm text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
					>
						[esc] cancel
					</button>
				</div>
			</div>
		</div>
	);
}
