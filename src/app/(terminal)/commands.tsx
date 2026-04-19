"use client";

import type { ReactNode } from "react";
import { Typewriter } from "./Typewriter";

export type WindowResult = {
	__window: true;
	title: string;
	body: ReactNode;
	inline?: ReactNode;
};

export type CommandResult = ReactNode | WindowResult;

export function isWindowResult(r: CommandResult): r is WindowResult {
	return (
		typeof r === "object" &&
		r !== null &&
		"__window" in r &&
		(r as WindowResult).__window === true
	);
}

function asWindow(
	title: string,
	body: ReactNode,
	inline?: ReactNode
): WindowResult {
	return { __window: true, title, body, inline };
}

export type CommandDef = {
	name: string;
	description: string;
	render: (args: string[]) => CommandResult;
};

type Role = {
	slug: string;
	company: string;
	title: string;
	period: string;
	stack: string[];
	points: string[];
	link?: string;
};

type LogEntry = {
	id: string;
	date: string;
	title: string;
	tags: string[];
	body: ReactNode;
};

type LearnTopic = {
	slug: string;
	title: string;
	description: string;
	status: "in-progress" | "done";
	articles: { layer: string; title: string; description: string }[];
};

const ROLES: Role[] = [
	{
		slug: "entendre",
		company: "Entendre Finance",
		title: "Full-Stack Engineer",
		period: "2023 – 2025",
		link: "https://entendre.finance",
		stack: ["Next.js", "Node.js", "MongoDB", "AWS"],
		points: [
			"built a visual rules engine with user-configurable cron jobs for automated transaction classification",
			"owned Stripe billing integration, background job infrastructure, and financial reporting",
			"shipped multi-timezone support, QuickBooks/Xero GL sync, and full accounting period management",
			"implemented pixel-perfect UI from Figma, shadcn-based filtering, and API layer (TanStack Query, JWT auth)",
		],
	},
	{
		slug: "poplink",
		company: "Poplink Ads",
		title: "Founding Engineer",
		period: "2022",
		stack: ["React", "Node.js", "NLP (MonkeyLearn)"],
		points: [
			"contextual ad overlays for blogs without third-party cookies",
			"pre-computed article↔ad matching from semantic context maps",
			"lightweight ptag embed + viewport keyword tracking for in-content popups",
			"click attribution through redirect funnel — privacy-first, no user tracking",
		],
	},
];

const DEV_LOG: LogEntry[] = [
	{
		id: "ai-chat",
		date: "2026-03-08",
		title: "AI Chat Resolution System — Before vs After",
		tags: ["ai", "architecture"],
		body: (
			<div className="space-y-3">
				<p>
					shipped a major overhaul of the chat resolution system. started with
					a basic single-pass LLM classifier and ~30 atomic intent schemas.
					ended up rebuilding most of the pipeline.
				</p>
				<div>
					<p className="text-[var(--accent)]">&gt; before</p>
					<ul className="ml-4 list-disc text-[var(--muted)]">
						<li>single-pass LLM classifier (classify + extract in one call)</li>
						<li>sequential MCP tool execution, no custom logic</li>
						<li>
							no disambiguation for{" "}
							<Code>db_lookup</Code> slots — multi-option results were a dead
							end
						</li>
						<li>no way for user to correct mid-flow values</li>
						<li>no precondition validation before execution</li>
						<li>state always cleared after execution, success or failure</li>
					</ul>
				</div>
				<div className="space-y-2">
					<p className="text-[var(--accent)]">&gt; after</p>
					<p>
						<span className="text-[var(--accent)]">1. two-pass classifier</span>{" "}
						— pass 1 classifies intent + confidence. pass 2 extracts values
						using correct field names from schema with description hints.
						accuracy jumped.
					</p>
					<p>
						<span className="text-[var(--accent)]">
							2. db_lookup disambiguation
						</span>{" "}
						— pending options persisted across turns. user can reply with exact
						name, numeric pick (&quot;2&quot;), or partial string. previously
						dead-end prompts now resolve.
					</p>
					<p>
						<span className="text-[var(--accent)]">
							3. handler / precondition system
						</span>{" "}
						— <Code>ExecutionStep.handler</Code> runs custom async logic
						instead of MCP call. <Code>PreconditionError</Code> aborts with
						user-facing message; orchestrator preserves state so user can fix
						and retry.
					</p>
					<p>
						<span className="text-[var(--accent)]">4. new intents</span> —{" "}
						<Code>add_multiple_activity_definitions</Code>,{" "}
						<Code>set_leaf_activity_duration</Code>,{" "}
						<Code>bulk_create_assets</Code> (redesigned with start/end
						numbers).
					</p>
					<p>
						<span className="text-[var(--accent)]">5. new MCP tool</span> —{" "}
						<Code>update_activity_instance</Code> fills the gap where
						definitions had full CRUD but instances had no update.
					</p>
					<p>
						<span className="text-[var(--accent)]">
							6. classifier disambiguation rules
						</span>{" "}
						— asset vs asset type, single vs multi-activity, duration
						examples, prerequisite suggestions on empty db_lookup.
					</p>
					<p>
						<span className="text-[var(--accent)]">
							7. orchestrator hardening
						</span>{" "}
						— <Code>resolveIntent</Code> gets <Code>{"{ message }"}</Code> for
						disambiguation. state preserved on precondition failure. SSE
						events: <Code>resolution_progress</Code> +{" "}
						<Code>resolution_complete</Code> with next-step suggestions.
					</p>
				</div>
				<p className="text-[var(--accent)]">
					&gt; 72 tests across 8 suites — all passing.
				</p>
			</div>
		),
	},
	{
		id: "tcp-seq",
		date: "2026-03-08",
		title: "TCP sequence numbers click",
		tags: ["networking", "tcp"],
		body: (
			<p>
				built an interactive demo for TCP sequence numbers today. the key
				insight: sequence numbers aren&apos;t just counters — they&apos;re byte
				offsets. when a receiver sends ACK 1001, it means &quot;i have
				everything up to byte 1000, send me 1001 next.&quot; duplicate ACKs (3
				of them) trigger fast retransmit without waiting for the full timeout.
			</p>
		),
	},
	{
		id: "fm-stagger",
		date: "2026-03-07",
		title: "Framer Motion stagger pattern",
		tags: ["react", "animation"],
		body: (
			<p>
				found a clean pattern for staggering child animations in framer motion.
				instead of manually calculating delays, use{" "}
				<Code>{"transition={{ delay: index * 0.05 }}"}</Code> on mapped items.
				feels much more natural than CSS animation-delay. also learned that{" "}
				<Code>whileInView</Code> with <Code>{"viewport={{ once: true }}"}</Code>{" "}
				prevents re-triggering on scroll.
			</p>
		),
	},
	{
		id: "tw-v4",
		date: "2026-03-05",
		title: "Tailwind v4 @theme directive",
		tags: ["tailwind", "css"],
		body: (
			<p>
				migrated from tailwind v3 to v4. the new{" "}
				<Code>@import &quot;tailwindcss&quot;</Code> replaces the old
				directives. custom colors now go in <Code>@theme</Code> blocks in CSS
				instead of tailwind.config. typography plugin still works —{" "}
				<Code>@plugin &quot;@tailwindcss/typography&quot;</Code>.
			</p>
		),
	},
];

const LEARN_TOPICS: LearnTopic[] = [
	{
		slug: "networking",
		title: "Networking",
		description: "TCP/IP, DNS, HTTP, and how the internet works",
		status: "in-progress",
		articles: [
			{
				layer: "L1-2",
				title: "Physical & Data Link",
				description: "Ethernet frames, MAC addresses, CSMA/CD, CRC",
			},
			{
				layer: "L3",
				title: "Network Layer",
				description: "IP addresses, routing, ICMP, IPv6",
			},
		],
	},
];

function Code({ children }: { children: ReactNode }) {
	return (
		<code className="rounded bg-[var(--accent-glow)]/10 px-1 text-[var(--accent)]">
			{children}
		</code>
	);
}

function EntendreDeepDive() {
	return (
		<div className="space-y-4 leading-relaxed">
			<section>
				<p className="mb-2 text-[var(--accent)] glow">## the problem</p>
				<p>
					crypto accounting is a nightmare. transactions flow in from dozens of
					wallets and exchanges, each with different data formats. accountants
					must classify thousands of transactions into proper journal entries —
					doing this manually is slow, error-prone, and doesn&apos;t scale.
					teams needed a way to define classification rules once and have the
					system apply them automatically across their entire transaction
					history.
				</p>
			</section>

			<section>
				<p className="mb-2 text-[var(--accent)] glow">## core features</p>
				<div className="space-y-3">
					<div>
						<p className="text-[var(--accent)]">rules engine ui</p>
						<p>
							visual condition-builder: users create classification rules (e.g.
							&quot;if source wallet is X and amount &gt; Y, categorize as
							revenue&quot;) that auto-generate journal entries. complex
							AND/OR logic, preview of matching transactions, journal entry
							preview before commit. built{" "}
							<span className="text-[var(--accent)]">
								user-configurable cron jobs
							</span>{" "}
							for scheduled classification.
						</p>
					</div>
					<div>
						<p className="text-[var(--accent)]">background job infrastructure</p>
						<p>
							reliable pipelines for backfills, asset snapshots,
							reconciliation, long-running transaction processing — with
							retry logic and failure recovery. jobs could be triggered from
							anywhere in the UI (sheets, modals, bulk actions) with inline
							progress. navigate away and tracking moved to a{" "}
							<span className="text-[var(--accent)]">global job tracker</span>{" "}
							in the corner: monitor all running jobs, pause/cancel, see
							real-time progress without losing context.
						</p>
					</div>
					<div>
						<p className="text-[var(--accent)]">stripe billing</p>
						<p>
							full subscription lifecycle: trials, plan enforcement, upgrades,
							payment reliability. handled edge cases like failed payments,
							mid-cycle plan changes, usage-based billing.
						</p>
					</div>
					<div>
						<p className="text-[var(--accent)]">s3 presigned uploads</p>
						<p>
							secure file attachments via presigned urls. files upload direct
							to s3, bypassing our servers. s3 events trigger lambda to update
							db references.
						</p>
					</div>
				</div>
			</section>

			<section>
				<p className="mb-2 text-[var(--accent)] glow">## accounting features</p>
				<div className="space-y-3">
					<div>
						<p className="text-[var(--accent)]">multi-timezone support</p>
						<p>
							different firms needed different end-of-day cutoffs based on
							location. org-level timezone config affects timestamps, reports,
							data filtering. critically, accounting periods depend on
							timezone — a transaction at 11 PM UTC on march 31 falls in
							march for a london firm but april for tokyo. changing timezone{" "}
							<span className="text-[var(--accent)]">
								invalidates existing journal entries
							</span>{" "}
							and requires re-classification, so users see a confirmation
							showing exactly which periods and entries will be affected.
						</p>
					</div>
					<div>
						<p className="text-[var(--accent)]">third-party gl sync</p>
						<p>
							quickbooks + xero unified into a single service handling auth,
							field mapping, and error recovery consistently across platforms.
						</p>
					</div>
					<div>
						<p className="text-[var(--accent)]">period management</p>
						<p>
							journal entry rollups for period closes. on-demand ledger balance
							recalculation. impairment workflows with audit trails.
						</p>
					</div>
					<div>
						<p className="text-[var(--accent)]">financial reporting</p>
						<p>
							all reports (balance sheet, trial balance, income statement) are
							powered by pre-computed account balances, not calculated
							on-the-fly. when a period closes, ending balances are computed
							from journal entries and{" "}
							<span className="text-[var(--accent)]">carried forward</span> as
							the next period&apos;s opening balance. reports are instant
							regardless of transaction volume.
						</p>
					</div>
				</div>
			</section>

			<section>
				<p className="mb-2 text-[var(--accent)] glow">## platform work</p>
				<ul className="ml-4 list-disc space-y-1">
					<li>
						pixel-perfect ui components from figma — tables, sheets, modals
					</li>
					<li>shadcn-based filtering system with persisted saved tabs</li>
					<li>
						api layer with tanstack query, jwt auth, optimistic updates, cache
						invalidation
					</li>
					<li>
						ci/cd pipelines — type checks, tests, deploys to staging/prod
					</li>
				</ul>
			</section>
		</div>
	);
}

function NetworkingL12Article() {
	return (
		<div className="space-y-5 leading-relaxed">
			<section>
				<p className="mb-2 text-[var(--accent)] glow">## learning objectives</p>
				<ol className="ml-4 list-decimal space-y-1 text-[var(--muted)]">
					<li>identify the parts of an ethernet frame</li>
					<li>
						explain mac address structure — oui vs device portion,
						unicast/multicast bit, universal/local bit
					</li>
					<li>
						distinguish unicast, broadcast, multicast — when each is used
					</li>
					<li>
						describe csma/cd — how devices detect collisions, why the
						64-byte minimum frame size exists
					</li>
					<li>
						explain why crc beats simple checksums for burst error detection
					</li>
					<li>describe how arp bridges layer 2 and layer 3</li>
				</ol>
			</section>

			<section>
				<p className="mb-2 text-[var(--accent)] glow">
					## layers of abstraction
				</p>
				<p>
					the osi model is a stack of abstractions. at the bottom, everything
					is voltage changes on a wire — bits. each layer above solves a
					different problem without worrying about the layers below. l1
					(physical) moves bits. l2 (data link) groups bits into frames,
					addresses devices on a local network, detects errors. l3 (network)
					routes packets between networks. l4 (transport) manages end-to-end
					delivery.
				</p>
			</section>

			<section>
				<p className="mb-2 text-[var(--accent)] glow">## ethernet frame</p>
				<p>
					a frame is just a sequence of bytes with a well-known structure:
				</p>
				<pre className="my-2 overflow-x-auto rounded bg-[var(--accent-glow)]/5 p-3 text-xs text-[var(--accent)]">
					{`[preamble 7B] [sfd 1B] [dest mac 6B] [src mac 6B] [ethertype 2B] [payload 46–1500B] [fcs 4B]`}
				</pre>
				<ul className="ml-4 list-disc space-y-1">
					<li>
						<span className="text-[var(--accent)]">preamble + sfd</span> —
						alternating 1s/0s to sync receiver clocks, then a fixed pattern
						marking start of frame
					</li>
					<li>
						<span className="text-[var(--accent)]">dest/src mac</span> —
						48-bit addresses. dest first so switches can route without
						buffering whole frame
					</li>
					<li>
						<span className="text-[var(--accent)]">ethertype</span> — what
						protocol is in the payload. 0x0800 = ipv4, 0x86dd = ipv6, 0x0806 = arp
					</li>
					<li>
						<span className="text-[var(--accent)]">payload</span> — the l3
						packet. minimum 46 bytes so total frame ≥ 64 (needed for collision
						detection)
					</li>
					<li>
						<span className="text-[var(--accent)]">fcs</span> — crc32 of
						everything from dest mac onward. if it fails, frame is dropped
						silently
					</li>
				</ul>
			</section>

			<section>
				<p className="mb-2 text-[var(--accent)] glow">## mac addresses</p>
				<p>
					48 bits, usually written as 6 hex pairs separated by colons:{" "}
					<span className="text-[var(--accent)]">00:1a:2b:3c:4d:5e</span>.
					first 24 bits are the{" "}
					<span className="text-[var(--accent)]">oui</span>{" "}
					(organizationally unique identifier) — assigned to manufacturers by
					ieee. last 24 bits are the device-specific portion.
				</p>
				<p>two bits of the first byte carry meaning:</p>
				<ul className="ml-4 list-disc space-y-1">
					<li>
						<span className="text-[var(--accent)]">i/g bit</span> (lowest bit
						of first byte) — 0 = unicast, 1 = multicast/broadcast
					</li>
					<li>
						<span className="text-[var(--accent)]">u/l bit</span> (second
						lowest) — 0 = universally administered (burned in), 1 = locally
						administered (vms, containers, privacy randomization)
					</li>
				</ul>
			</section>

			<section>
				<p className="mb-2 text-[var(--accent)] glow">
					## unicast / broadcast / multicast
				</p>
				<ul className="ml-4 list-disc space-y-1">
					<li>
						<span className="text-[var(--accent)]">unicast</span> — one
						specific device. nic compares dest mac to its own; drops if no
						match
					</li>
					<li>
						<span className="text-[var(--accent)]">broadcast</span> —{" "}
						<span className="text-[var(--accent)]">ff:ff:ff:ff:ff:ff</span>.
						all devices on the segment process it. used by arp, dhcp
					</li>
					<li>
						<span className="text-[var(--accent)]">multicast</span> — a
						specific group of interested devices. ipv6 nd, mdns, video
						streaming
					</li>
				</ul>
			</section>

			<section>
				<p className="mb-2 text-[var(--accent)] glow">## csma/cd</p>
				<p>
					carrier sense multiple access with collision detection. the
					coordination protocol for shared-medium ethernet (the original hub
					era, before switched networks were universal). each device:
				</p>
				<ol className="ml-4 list-decimal space-y-1">
					<li>listens to the wire (carrier sense)</li>
					<li>if idle, transmits</li>
					<li>
						keeps listening while transmitting — if voltage doesn&apos;t
						match what it sent, there&apos;s a collision
					</li>
					<li>on collision: sends jam signal, waits random backoff, retries</li>
				</ol>
				<p>
					the <span className="text-[var(--accent)]">64-byte minimum</span>{" "}
					exists because a sender must still be transmitting when a collision
					signal makes it back, otherwise it won&apos;t know the transmission
					failed. 64 bytes × 8 bits ÷ 10 mbps = 51.2µs, enough round-trip time
					for a 500m segment with repeaters.
				</p>
				<p className="text-[var(--muted)]">
					modern switched ethernet is full-duplex with no collisions — csma/cd
					is historical but the frame size minimum lives on.
				</p>
			</section>

			<section>
				<p className="mb-2 text-[var(--accent)] glow">
					## crc vs simple checksum
				</p>
				<p>
					a simple additive checksum (sum all bytes mod N) detects
					single-bit flips but can miss correlated errors — flip two bits
					that cancel out and the sum is unchanged. real-world errors on
					wires tend to be{" "}
					<span className="text-[var(--accent)]">burst errors</span>: a
					cluster of adjacent bits all flipped by interference.
				</p>
				<p>
					crc treats the data as coefficients of a polynomial and divides by
					a generator polynomial (crc32 uses a specific 33-bit one). the
					remainder is the fcs. any burst error shorter than the polynomial
					degree is guaranteed to be detected, because polynomial division
					has the property that a single non-zero bit in the error
					polynomial produces a non-zero remainder.
				</p>
			</section>

			<section>
				<p className="mb-2 text-[var(--accent)] glow">## arp</p>
				<p>
					address resolution protocol: layer 2 delivery needs a mac address,
					but apps give you an ip. arp bridges the two.
				</p>
				<ol className="ml-4 list-decimal space-y-1">
					<li>
						host wants to send to 192.168.1.10, checks its arp cache — miss
					</li>
					<li>
						broadcasts: &quot;who has 192.168.1.10? tell 192.168.1.5&quot;
					</li>
					<li>
						the owner replies with its mac; host caches for ~minutes to hours
					</li>
					<li>
						subsequent frames go directly as unicast
					</li>
				</ol>
				<p className="text-[var(--muted)]">
					gratuitous arp (sending a reply nobody asked for) is how devices
					announce ip takeover or detect conflicts — and how arp spoofing
					attacks work.
				</p>
			</section>
		</div>
	);
}

function RoleSummary({ role }: { role: Role }) {
	return (
		<p>
			<span className="text-[var(--accent)]">{role.slug}</span>
			<span className="text-[var(--muted)]">  ·  </span>
			<span>{role.company}</span>
			<span className="text-[var(--muted)]"> — {role.title}</span>
			<span className="text-[var(--muted)]"> — {role.period}</span>
		</p>
	);
}

function RoleDetail({ role }: { role: Role }) {
	return (
		<div className="space-y-2">
			<div>
				<p>
					{role.link ? (
						<Link href={role.link}>
							<span className="text-[var(--accent)]">{role.company}</span>
						</Link>
					) : (
						<span className="text-[var(--accent)]">{role.company}</span>
					)}
					<span className="text-[var(--muted)]"> — {role.title}</span>
				</p>
				<p className="text-[var(--muted)]">{role.period}</p>
			</div>
			<div className="flex flex-wrap gap-x-2">
				<span className="w-20 shrink-0 text-[var(--muted)]">stack</span>
				<span>{role.stack.join(" · ")}</span>
			</div>
			<ul className="space-y-1">
				{role.points.map((p, i) => (
					<li key={i}>
						<span className="text-[var(--accent)]">◢</span> {p}
					</li>
				))}
			</ul>
		</div>
	);
}

const PITCHES = [
	"a skilled technical individual seeking a reliable partner to deliver consistent, predictable results?",
	"a non-technical visionary in search of a dependable partner who can guide you toward your next billion-dollar idea?",
	"a dedicated team with everything in place, seeking an extra hand on deck to support your endeavors?",
	"an individual aspiring to create an outstanding portfolio like this one?",
];

const STACK: { group: string; items: string[] }[] = [
	{
		group: "domain",
		items: [
			"Accounting Systems",
			"Billing & Payments",
			"Financial Reporting",
			"Compliance & Audit",
		],
	},
	{
		group: "systems",
		items: [
			"Background Jobs",
			"Data Pipelines",
			"Rules Engines",
			"Third-party Integrations",
		],
	},
	{ group: "core", items: ["MongoDB", "Express", "React", "Node"] },
	{ group: "frameworks", items: ["Next.js", "Create React App"] },
	{
		group: "state + data",
		items: ["Redux", "Immer", "React Query", "React Router", "React Table"],
	},
	{ group: "ui + 3d", items: ["Tailwind", "Bootstrap", "Three.js"] },
	{
		group: "languages",
		items: ["TypeScript", "JavaScript", "HTML", "CSS"],
	},
	{
		group: "cloud + infra",
		items: ["AWS", "Serverless Framework", "GitHub Actions"],
	},
	{ group: "shells", items: ["GNU Bash", "PowerShell"] },
	{
		group: "tooling",
		items: ["GitHub", "Turborepo", "Lerna", "Conventional Commits"],
	},
];

function Link({ href, children }: { href: string; children: ReactNode }) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noreferrer"
			className="text-[var(--accent)] underline decoration-dotted underline-offset-2 hover:decoration-solid"
		>
			{children}
		</a>
	);
}

const CATEGORIES: { name: string; commands: string[] }[] = [
	{ name: "identity", commands: ["whoami", "intro"] },
	{ name: "work", commands: ["work", "stack", "how"] },
	{ name: "writing", commands: ["log", "learn"] },
	{ name: "reach", commands: ["contact", "chat", "coffee"] },
	{ name: "shell", commands: ["ls", "help", "clear"] },
];

export const COMMANDS: Record<string, CommandDef> = {
	whoami: {
		name: "whoami",
		description: "identity",
		render: () => (
			<div className="space-y-1">
				<p>
					akshay — full-stack engineer, fintech focus.{" "}
					<span className="text-[var(--muted)]">delhi, india.</span>
				</p>
				<p className="text-[var(--muted)]">
					accounting systems, billing, background jobs, rule-driven workflows.
				</p>
				<p className="text-[var(--muted)]">
					TypeScript · Node · Next.js · MongoDB. TDD + DDD, hexagonal.
				</p>
				<p>
					<span className="text-[var(--accent)]">&gt;</span> open to fintech
					teams building accounting, billing, or financial infrastructure.
				</p>
			</div>
		),
	},
	how: {
		name: "how",
		description: "how i work",
		render: () => (
			<div className="space-y-2">
				<p>
					<span className="text-[var(--accent)]">Claude Code</span> for
					implementation. <span className="text-[var(--accent)]">TDD</span> and{" "}
					<span className="text-[var(--accent)]">DDD</span> with hexagonal
					architecture.
				</p>
				<p>
					most of my effort goes into{" "}
					<span className="text-[var(--accent)]">design discussions</span> —
					defining boundaries, clarifying constraints, shaping the domain
					model.
				</p>
				<p className="text-[var(--muted)]">
					the bottleneck is no longer writing code; it&apos;s context window
					management. AI writes accurate code when given precise constraints.
					my job is ensuring those constraints are clear.
				</p>
				<p>
					<span className="text-[var(--accent)]">&gt;</span> delivery compressed
					from months to hours.
				</p>
			</div>
		),
	},
	intro: {
		name: "intro",
		description: "the pitch",
		render: () => {
			const pitch = PITCHES[Math.floor(Math.random() * PITCHES.length)];
			return (
				<div className="space-y-2">
					<p>hi there,</p>
					<p>
						are you <Typewriter html={pitch} speed={18} />
					</p>
					<p className="text-[var(--muted)]">
						run <span className="text-[var(--accent)]">chat</span> to reach
						out.
					</p>
				</div>
			);
		},
	},
	stack: {
		name: "stack",
		description: "tools of the trade",
		render: () => (
			<div className="space-y-2">
				{STACK.map((row) => (
					<div key={row.group} className="flex flex-wrap gap-x-2">
						<span className="w-36 shrink-0 text-[var(--muted)]">
							{row.group}
						</span>
						<span>{row.items.join(" · ")}</span>
					</div>
				))}
			</div>
		),
	},
	work: {
		name: "work",
		description: "experience · `work <slug>` · `work <slug> --deep`",
		render: (args) => {
			if (args.length === 0) {
				return (
					<div className="space-y-1">
						{ROLES.map((r) => (
							<RoleSummary key={r.slug} role={r} />
						))}
						<p className="pt-1 text-[var(--muted)]">
							run{" "}
							<span className="text-[var(--accent)]">work &lt;slug&gt;</span>{" "}
							for detail,{" "}
							<span className="text-[var(--accent)]">
								work &lt;slug&gt; --deep
							</span>{" "}
							for full case study, or{" "}
							<span className="text-[var(--accent)]">work --all</span> for
							everything.
						</p>
					</div>
				);
			}
			if (args[0] === "--all") {
				return (
					<div className="space-y-4">
						{ROLES.map((r) => (
							<RoleDetail key={r.slug} role={r} />
						))}
					</div>
				);
			}
			const role = ROLES.find((r) => r.slug === args[0].toLowerCase());
			if (!role) {
				return (
					<span className="text-rose-400/90">
						no role: {args[0]} — try{" "}
						<span className="text-[var(--accent)]">work</span> to list slugs.
					</span>
				);
			}
			if (args.includes("--deep")) {
				if (role.slug !== "entendre") {
					return (
						<span className="text-rose-400/90">
							no deep case study for {role.slug} yet — try{" "}
							<span className="text-[var(--accent)]">work entendre --deep</span>.
						</span>
					);
				}
				return asWindow(
					`case study: ${role.company}`,
					<EntendreDeepDive />,
					<span className="text-[var(--muted)]">
						opened window ·{" "}
						<span className="text-[var(--accent)]">{role.company}</span> case
						study
					</span>
				);
			}
			return <RoleDetail role={role} />;
		},
	},
	log: {
		name: "log",
		description: "dev log · try `log <id>`",
		render: (args) => {
			if (args.length === 0) {
				return (
					<div className="space-y-1">
						{DEV_LOG.map((e) => (
							<p key={e.id}>
								<span className="text-[var(--muted)]">{e.date}</span>{" "}
								<span className="text-[var(--accent)]">{e.id}</span>
								<span className="text-[var(--muted)]"> — </span>
								<span>{e.title}</span>
								<span className="text-[var(--muted)]">
									{" "}
									[{e.tags.join(", ")}]
								</span>
							</p>
						))}
						<p className="pt-1 text-[var(--muted)]">
							run <span className="text-[var(--accent)]">log &lt;id&gt;</span>{" "}
							to read an entry.
						</p>
					</div>
				);
			}
			const entry = DEV_LOG.find((e) => e.id === args[0].toLowerCase());
			if (!entry) {
				return (
					<span className="text-rose-400/90">
						no entry: {args[0]} — try{" "}
						<span className="text-[var(--accent)]">log</span> to list.
					</span>
				);
			}
			return (
				<div className="space-y-2">
					<div>
						<p className="text-[var(--muted)]">
							{entry.date} · [{entry.tags.join(", ")}]
						</p>
						<p className="text-[var(--accent)] glow">{entry.title}</p>
					</div>
					{entry.body}
				</div>
			);
		},
	},
	learn: {
		name: "learn",
		description: "learning notes · `learn <topic>` · `learn <topic>/<article>`",
		render: (args) => {
			if (args.length === 0) {
				return (
					<div className="space-y-2">
						<p className="text-[var(--muted)]">
							you only truly understand something if you can teach it.
						</p>
						{LEARN_TOPICS.map((t) => (
							<div key={t.slug}>
								<p>
									<span className="text-[var(--accent)]">{t.slug}</span>
									<span className="text-[var(--muted)]"> — {t.description}</span>
									{t.status === "in-progress" && (
										<span className="ml-2 text-[var(--muted)]">
											[in-progress]
										</span>
									)}
								</p>
							</div>
						))}
						<p className="pt-1 text-[var(--muted)]">
							run{" "}
							<span className="text-[var(--accent)]">learn &lt;slug&gt;</span>{" "}
							for topic detail.
						</p>
					</div>
				);
			}
			const [topicSlug, articleSlug] = args[0].toLowerCase().split("/");
			const topic = LEARN_TOPICS.find((t) => t.slug === topicSlug);
			if (!topic) {
				return (
					<span className="text-rose-400/90">
						no topic: {args[0]} — try{" "}
						<span className="text-[var(--accent)]">learn</span> to list.
					</span>
				);
			}
			if (articleSlug) {
				if (topicSlug === "networking" && articleSlug === "ethernet") {
					return asWindow(
						"learn: networking / physical & data link",
						<NetworkingL12Article />,
						<span className="text-[var(--muted)]">
							opened window ·{" "}
							<span className="text-[var(--accent)]">
								networking L1-2
							</span>{" "}
							article
						</span>
					);
				}
				return (
					<span className="text-rose-400/90">
						article not yet ported: {args[0]} — available:{" "}
						<span className="text-[var(--accent)]">
							networking/ethernet
						</span>
					</span>
				);
			}
			return (
				<div className="space-y-2">
					<p>
						<span className="text-[var(--accent)] glow">{topic.title}</span>
						<span className="text-[var(--muted)]"> — {topic.description}</span>
					</p>
					<ul className="space-y-1">
						{topic.articles.map((a, i) => {
							const slug = i === 0 ? "ethernet" : "ipv4";
							return (
								<li key={a.layer}>
									<span className="text-[var(--muted)]">{a.layer}</span>{" "}
									<span className="text-[var(--accent)]">
										{topic.slug}/{slug}
									</span>
									<span className="text-[var(--muted)]"> — {a.title}</span>
									<span className="text-[var(--muted)]">
										{" "}
										· {a.description}
									</span>
								</li>
							);
						})}
					</ul>
					<p className="text-[var(--muted)]">
						status: {topic.status} · open an article with{" "}
						<span className="text-[var(--accent)]">
							learn {topic.slug}/&lt;article&gt;
						</span>
					</p>
				</div>
			);
		},
	},
	contact: {
		name: "contact",
		description: "reach out",
		render: () => (
			<div className="space-y-1">
				<p>
					<span className="w-20 inline-block text-[var(--muted)]">email</span>
					<Link href="mailto:akshay.nm92@gmail.com">akshay.nm92@gmail.com</Link>
				</p>
				<p>
					<span className="w-20 inline-block text-[var(--muted)]">github</span>
					<Link href="https://github.com/akshay-nm">@akshay-nm</Link>
				</p>
				<p>
					<span className="w-20 inline-block text-[var(--muted)]">linkedin</span>
					<Link href="https://linkedin.com/in/akshay-nm">/in/akshay-nm</Link>
				</p>
			</div>
		),
	},
	chat: {
		name: "chat",
		description: "say hi",
		render: () => (
			<div className="space-y-1">
				<Typewriter
					html={`this is a fancy way of saying you can reach me at <a class="text-[#00ff9c] underline decoration-dotted underline-offset-2" href="mailto:akshay.nm92@gmail.com">akshay.nm92@gmail.com</a> and i'll get back to you as soon as i can. cheers.`}
					speed={14}
				/>
			</div>
		),
	},
	coffee: {
		name: "coffee",
		description: "buy me one?",
		render: () => (
			<div className="space-y-1">
				<p>if this site made you smile:</p>
				<p>
					<Link href="https://buymeacoffee.com/akshaynm92">
						buymeacoffee.com/akshaynm92
					</Link>
				</p>
				<p className="text-[var(--muted)]">much appreciated.</p>
			</div>
		),
	},
	ls: {
		name: "ls",
		description: "list sections",
		render: () => (
			<div className="space-y-2">
				<p className="text-[var(--muted)]">
					drwxr-xr-x akshay akshay ~/
				</p>
				{CATEGORIES.map((cat) => (
					<div key={cat.name}>
						<p className="text-[var(--muted)]">
							drwxr-xr-x akshay akshay {cat.name}/
						</p>
						{cat.commands
							.filter((n) => n !== "clear")
							.map((n) => {
								const c = COMMANDS[n];
								if (!c) return null;
								return (
									<p key={n} className="pl-4">
										<span className="text-[var(--muted)]">
											-rw-r--r--
										</span>{" "}
										<span className="text-[var(--accent)]">{c.name}</span>
										<span className="text-[var(--muted)]">
											{" "}
											— {c.description}
										</span>
									</p>
								);
							})}
					</div>
				))}
			</div>
		),
	},
	help: {
		name: "help",
		description: "list commands",
		render: () => (
			<div className="space-y-3">
				<p className="text-[var(--muted)]">available commands:</p>
				{CATEGORIES.map((cat) => (
					<div key={cat.name}>
						<p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
							// {cat.name}
						</p>
						<ul className="mt-1 space-y-0.5">
							{cat.commands.map((n) => {
								if (n === "clear") {
									return (
										<li key="clear">
											<span className="text-[var(--accent)]">clear</span>
											<span className="text-[var(--muted)]">
												{" "}
												— reset the terminal
											</span>
										</li>
									);
								}
								const c = COMMANDS[n];
								if (!c) return null;
								return (
									<li key={n}>
										<span className="text-[var(--accent)]">{c.name}</span>
										<span className="text-[var(--muted)]">
											{" "}
											— {c.description}
										</span>
									</li>
								);
							})}
						</ul>
					</div>
				))}
			</div>
		),
	},
};

export const COMMAND_LIST = Object.values(COMMANDS);
