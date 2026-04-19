"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { COMMANDS, COMMAND_LIST, isWindowResult } from "./commands";
import { LoadingGate } from "./LoadingGate";
import { Prompt } from "./Prompt";
import { RedirectDialog } from "./RedirectDialog";
import { Window } from "./Window";

type LogEntry = {
	id: number;
	command: string;
	output: ReactNode;
};

type OpenWindow = {
	id: number;
	title: string;
	body: ReactNode;
	z: number;
	initial: { x: number; y: number };
};

function Welcome() {
	return (
		<div className="space-y-2 text-sm">
			<p className="text-[var(--accent)] glow">
				akshay.ooo · terminal v0.1
			</p>
			<p className="text-[var(--muted)]">
				type a command and hit enter. try{" "}
				<span className="text-[var(--accent)]">help</span> to list them.
			</p>
			<ul className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
				{COMMAND_LIST.map((c) => (
					<li key={c.name}>
						<span className="text-[var(--accent)]">{c.name}</span>
						<span className="ml-2 text-[var(--muted)]">{c.description}</span>
					</li>
				))}
				<li>
					<span className="text-[var(--accent)]">clear</span>
					<span className="ml-2 text-[var(--muted)]">reset the terminal</span>
				</li>
			</ul>
		</div>
	);
}

export default function Page() {
	const [entries, setEntries] = useState<LogEntry[]>([
		{ id: 0, command: "", output: <Welcome /> },
	]);
	const [history, setHistory] = useState<string[]>([]);
	const [nextId, setNextId] = useState(1);
	const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
	const [windows, setWindows] = useState<OpenWindow[]>([]);
	const [topZ, setTopZ] = useState(10);
	const scrollRef = useRef<HTMLDivElement>(null);

	const focusWindow = useCallback(
		(id: number) => {
			const next = topZ + 1;
			setTopZ(next);
			setWindows((ws) =>
				ws.map((w) => (w.id === id ? { ...w, z: next } : w))
			);
		},
		[topZ]
	);

	const closeWindow = useCallback((id: number) => {
		setWindows((ws) => ws.filter((w) => w.id !== id));
	}, []);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
		const inner = el.firstElementChild;
		if (!inner) return;
		const ro = new ResizeObserver(() => {
			el.scrollTop = el.scrollHeight;
		});
		ro.observe(inner);
		return () => ro.disconnect();
	}, [entries]);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			const anchor = (e.target as HTMLElement | null)?.closest?.("a[href]");
			if (!anchor) return;
			const href = anchor.getAttribute("href");
			if (!href || href.startsWith("#")) return;
			e.preventDefault();
			setPendingRedirect(href);
		};
		document.addEventListener("click", handler);
		return () => document.removeEventListener("click", handler);
	}, []);

	const confirmRedirect = useCallback(() => {
		if (!pendingRedirect) return;
		if (
			pendingRedirect.startsWith("mailto:") ||
			pendingRedirect.startsWith("tel:")
		) {
			window.location.href = pendingRedirect;
		} else {
			window.open(pendingRedirect, "_blank", "noopener,noreferrer");
		}
		setPendingRedirect(null);
	}, [pendingRedirect]);

	const cancelRedirect = useCallback(() => {
		setPendingRedirect(null);
	}, []);

	function handleCommand(raw: string) {
		setHistory((h) => [...h, raw]);
		const [head, ...args] = raw.trim().split(/\s+/);
		const cmd = head.toLowerCase();

		if (cmd === "clear") {
			setEntries([]);
			return;
		}

		const def = COMMANDS[cmd];
		if (!def) {
			setEntries((prev) => [
				...prev,
				{
					id: nextId,
					command: raw,
					output: (
						<span className="text-rose-400/90">
							command not found: {raw}
						</span>
					),
				},
			]);
			setNextId((n) => n + 1);
			return;
		}

		const result = def.render(args);

		if (isWindowResult(result)) {
			const newId = nextId;
			const nextZ = topZ + 1;
			const offset = windows.length;
			setTopZ(nextZ);
			setWindows((prev) => [
				...prev,
				{
					id: newId,
					title: result.title,
					body: result.body,
					z: nextZ,
					initial: { x: offset * 30, y: offset * 40 },
				},
			]);
			setEntries((prev) => [
				...prev,
				{
					id: newId,
					command: raw,
					output: (
						<LoadingGate>
							{result.inline ?? (
								<span className="text-[var(--muted)]">
									opened window ·{" "}
									<span className="text-[var(--accent)]">
										{result.title}
									</span>
								</span>
							)}
						</LoadingGate>
					),
				},
			]);
			setNextId((n) => n + 1);
			return;
		}

		setEntries((prev) => [
			...prev,
			{
				id: nextId,
				command: raw,
				output: <LoadingGate>{result}</LoadingGate>,
			},
		]);
		setNextId((n) => n + 1);
	}

	return (
		<main className="flex h-screen flex-col p-6 md:p-10">
			<header className="mb-4 flex items-baseline justify-between">
				<div className="flex items-baseline gap-3">
					<h1 className="text-sm tracking-[0.3em] text-[var(--accent)] glow">
						AKSHAY.OOO
					</h1>
					<span className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
						// terminal
					</span>
				</div>
				<span className="text-[10px] text-[var(--muted)]">
					{new Date().getFullYear()}
				</span>
			</header>

			<div
				ref={scrollRef}
				className="flex-1 overflow-y-auto pr-2"
			>
				<div className="space-y-4 pb-4">
					{entries.map((e) => (
						<div key={e.id} className="space-y-1">
							{e.command && (
								<div className="flex gap-2 text-sm">
									<span className="text-[var(--accent)] glow">
										akshay@ooo:~$
									</span>
									<span>{e.command}</span>
								</div>
							)}
							<div className="pl-[0.5rem] text-sm">{e.output}</div>
						</div>
					))}
				</div>
			</div>

			<div className="pt-2">
				<Prompt onSubmit={handleCommand} history={history} />
			</div>

			<div className="pointer-events-none fixed inset-0 z-30 p-6 md:p-10">
				<div className="relative h-full w-full" style={{ paddingTop: 120 }}>
					{windows.map((w) => (
						<Window
							key={w.id}
							title={w.title}
							z={w.z}
							initial={w.initial}
							onFocus={() => focusWindow(w.id)}
							onClose={() => closeWindow(w.id)}
						>
							{w.body}
						</Window>
					))}
				</div>
			</div>

			<RedirectDialog
				href={pendingRedirect}
				onConfirm={confirmRedirect}
				onCancel={cancelRedirect}
			/>
		</main>
	);
}
