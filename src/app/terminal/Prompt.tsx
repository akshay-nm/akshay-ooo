"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
	onSubmit: (raw: string) => void;
	history: string[];
};

export function Prompt({ onSubmit, history }: Props) {
	const [value, setValue] = useState("");
	const [cursor, setCursor] = useState<number | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();
		const refocus = () => inputRef.current?.focus();
		window.addEventListener("click", refocus);
		return () => window.removeEventListener("click", refocus);
	}, []);

	function recall(nextCursor: number | null) {
		setCursor(nextCursor);
		if (nextCursor === null) {
			setValue("");
		} else {
			setValue(history[nextCursor] ?? "");
		}
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				const trimmed = value.trim();
				if (!trimmed) return;
				onSubmit(trimmed);
				setValue("");
				setCursor(null);
			}}
			className="flex items-center gap-2"
		>
			<span className="text-[var(--accent)] glow">akshay@ooo:~$</span>
			<div className="relative flex-1">
				<input
					ref={inputRef}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "ArrowUp") {
							e.preventDefault();
							if (history.length === 0) return;
							const next =
								cursor === null
									? history.length - 1
									: Math.max(0, cursor - 1);
							recall(next);
						} else if (e.key === "ArrowDown") {
							e.preventDefault();
							if (cursor === null) return;
							const next = cursor + 1;
							recall(next >= history.length ? null : next);
						}
					}}
					spellCheck={false}
					autoComplete="off"
					className="w-full bg-transparent text-[var(--fg)] caret-transparent outline-none"
				/>
				<span
					className="cursor absolute"
					style={{ left: `${value.length}ch`, top: 0 }}
					aria-hidden
				/>
			</div>
		</form>
	);
}
