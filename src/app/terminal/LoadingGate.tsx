"use client";

import { useEffect, useState, type ReactNode } from "react";

const FRAMES = [
	"⠋",
	"⠙",
	"⠹",
	"⠸",
	"⠼",
	"⠴",
	"⠦",
	"⠧",
	"⠇",
	"⠏",
];

const DEFAULT_MESSAGES = [
	"resolving",
	"parsing",
	"fetching",
	"hydrating",
	"bootstrapping",
	"rendering",
	"indexing",
	"compiling",
];

function pick<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

type Props = {
	children: ReactNode;
	messages?: string[];
	duration?: number;
};

export function LoadingGate({ children, messages, duration }: Props) {
	const [done, setDone] = useState(false);
	const [frame, setFrame] = useState(0);
	const [resolvedDuration] = useState(
		() => duration ?? 380 + Math.floor(Math.random() * 320)
	);
	const [message] = useState(() => pick(messages ?? DEFAULT_MESSAGES));

	useEffect(() => {
		const interval = setInterval(() => {
			setFrame((f) => (f + 1) % FRAMES.length);
		}, 70);
		const timeout = setTimeout(() => setDone(true), resolvedDuration);
		return () => {
			clearInterval(interval);
			clearTimeout(timeout);
		};
	}, [resolvedDuration]);

	if (done) return <>{children}</>;

	return (
		<div className="flex items-center gap-2 text-[var(--muted)]">
			<span className="text-[var(--accent)] glow">{FRAMES[frame]}</span>
			<span>{message}...</span>
		</div>
	);
}
