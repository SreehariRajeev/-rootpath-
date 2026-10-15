"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import { GrowIn } from "@/components/motion/grow";
import {
  resetPointerLight,
  trackPointerLight,
} from "@/components/motion/pointer-light";
import {
  people,
  teamComplete,
  type Person,
} from "@/components/sections/team/people";
import { layoutTop, scrollToY } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";

/** Sticky offset that clears the navbar. */
const NAV = 96;
/** Height of the header tab left visible on each covered card. */
const TAB = 56;
const COUNT = people.length;
/** Every card is the same size, so nothing reflows as the stack moves or on hover. */
const CARD_HEIGHT = `min(30rem, calc(100svh - ${NAV + (COUNT - 1) * TAB + 24}px))`;

const tiltSpring = { stiffness: 180, damping: 20, mass: 0.6 };

function initials(name?: string) {
  if (!name) return "[ ]";
  const parts = name.trim().split(/\s+/);
  return `${parts[0][0]}${parts.length > 1 ? parts[parts.length - 1][0] : ""}`.toUpperCase();
}

function handle(person: Person) {
  return person.name
    ? person.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    : "[name]";
}

export function Team() {
  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="mx-auto max-w-7xl px-6 pt-24 sm:pt-28 lg:px-10 lg:pt-36"
    >
      <GrowIn offset={["start 95%", "start 45%"]}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16">
          <div>
            <p className="eyebrow">02 · Team</p>
            <h2
              id="team-heading"
              className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-[3.5rem]"
            >
              The people who will build it.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Every engagement is led and built by the senior designers and
            engineers below. You work with them directly, from the first
            conversation to release.
          </p>
        </div>
      </GrowIn>

      <Strength />

      {/* Desktop: profiles stack like files as you scroll. Phones: a simple list. */}
      <div className="hidden lg:block">
        <Stack />
      </div>
      <div className="grid gap-4 pb-24 pt-12 sm:pb-28 lg:hidden">
        {people.map((person, index) => (
          <GrowIn key={index} offset={["start 95%", "start 60%"]}>
            <ProfileCard person={person} index={index} />
          </GrowIn>
        ))}
      </div>
    </section>
  );
}

/** Team strength in numbers, counted up as the strip scrolls into view. */
function Strength() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "start 55%"],
  });
  const disciplines = new Set(people.map((person) => person.discipline));
  const combined = teamComplete
    ? people.reduce((sum, person) => sum + (person.years ?? 0), 0)
    : undefined;

  const stats: { value?: number; suffix?: string; label: string }[] = [
    { value: combined, suffix: "+", label: "years of combined experience" },
    { value: COUNT, label: "senior specialists on the team" },
    {
      value: disciplines.size,
      label: "disciplines: design, frontend, backend, engineering management",
    },
  ];

  return (
    <div
      ref={ref}
      className="mt-14 grid border-y border-border sm:grid-cols-3 lg:mt-16"
    >
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={cn(
            "flex items-baseline gap-4 py-6 sm:block sm:py-8",
            index > 0 &&
              "border-t border-border sm:border-l sm:border-t-0 sm:pl-8",
          )}
        >
          <p className="font-display text-5xl font-medium tabular-nums tracking-[-0.03em] text-foreground lg:text-6xl">
            {stat.value === undefined ? (
              <span className="text-muted-subtle">[ 00 ]</span>
            ) : (
              <>
                <CountUp value={stat.value} progress={scrollYProgress} />
                {stat.suffix ? (
                  <span className="text-accent">{stat.suffix}</span>
                ) : null}
              </>
            )}
          </p>
          <p className="mt-2 max-w-[16rem] font-mono text-xs leading-5 text-muted-subtle">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

function CountUp({
  value,
  progress,
}: {
  value: number;
  progress: MotionValue<number>;
}) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const shown = useTransform(progress, (p) => Math.round(value * p));
  if (shouldReduceMotion) return <>{value}</>;
  return <motion.span>{shown}</motion.span>;
}

/** Scroll spent bringing each profile to the front, in viewport heights. */
const STEP = 0.7;
/** Scroll held on the finished pile before it leaves, in viewport heights. */
const HOLD = 0.25;
const TRAVEL = (COUNT - 1) * STEP + HOLD;

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * A pinned stage where profiles stack like files: each one slides up from below and comes
 * to rest a tab's height lower than the last, and the covered cards recede, leaving their
 * header tabs as an index of the team. Everything sits in one sticky stage, so the
 * finished pile holds together and leaves as one.
 */
function Stack() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const trackRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const select = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    scrollToY(layoutTop(track) + index * STEP * window.innerHeight + 2);
  };

  return (
    <div
      ref={trackRef}
      className="relative mt-10"
      style={{ height: `${(1 + TRAVEL) * 100}svh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {people.map((person, index) => (
          <StackedCard
            key={index}
            person={person}
            index={index}
            progress={scrollYProgress}
            still={shouldReduceMotion}
            onSelect={() => select(index)}
          />
        ))}
      </div>
    </div>
  );
}

/** 0 while profile `index` is below the stage, 1 once it has come to rest. */
function arrivalAt(progress: number, index: number) {
  if (index === 0) return 1;
  const start = ((index - 1) * STEP) / TRAVEL;
  const end = (index * STEP) / TRAVEL;
  return easeInOut(
    Math.min(1, Math.max(0, (progress - start) / (end - start))),
  );
}

function StackedCard({
  person,
  index,
  progress,
  still,
  onSelect,
}: {
  person: Person;
  index: number;
  progress: MotionValue<number>;
  still: boolean;
  onSelect: () => void;
}) {
  const arrival = useTransform(progress, (p) => arrivalAt(p, index));
  const y = useTransform(arrival, (a) => `${(1 - a) * 100}vh`);
  // Depth: how many profiles now sit on top of this one (fractional while they slide in).
  const depth = useTransform(progress, (p) => {
    let sum = 0;
    for (let next = index + 1; next < COUNT; next++) sum += arrivalAt(p, next);
    return sum;
  });
  const scale = useTransform(depth, (d) => 1 - Math.min(d, 3) * 0.035);
  const shade = useTransform(depth, (d) => Math.min(d, 1) * 0.6);

  return (
    <motion.div
      className="absolute inset-x-0"
      style={{
        top: NAV + index * TAB,
        height: CARD_HEIGHT,
        y,
        scale: still ? 1 : scale,
        transformOrigin: "50% 0%",
        zIndex: index,
      }}
    >
      <ProfileCard
        person={person}
        index={index}
        onSelect={onSelect}
        interactive={!still}
        stacked
      />
      <motion.div
        aria-hidden="true"
        style={{ opacity: still ? 0 : shade }}
        className="pointer-events-none absolute inset-x-0 bottom-0 top-14 rounded-b-2xl bg-system-black"
      />
    </motion.div>
  );
}

interface ProfileCardProps {
  person: Person;
  index: number;
  /** Desktop stack: the header tab brings this profile to the front. */
  onSelect?: () => void;
  /** Pointer-tracked tilt and depth. */
  interactive?: boolean;
  /** Fixed height inside the stack; auto height in the phone list. */
  stacked?: boolean;
}

function ProfileCard({
  person,
  index,
  onSelect,
  interactive = false,
  stacked = false,
}: ProfileCardProps) {
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, tiltSpring);
  const rotateY = useSpring(tiltY, tiltSpring);
  const dotsX = useTransform(rotateY, (value) => value * -4);
  const dotsY = useTransform(rotateX, (value) => value * 4);

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    trackPointerLight(event);
    if (!interactive || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    tiltY.set(x * 4);
    tiltX.set(-y * 4);
  };
  const handleLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    resetPointerLight(event);
    tiltX.set(0);
    tiltY.set(0);
  };

  const tab = (
    <>
      <span className="text-accent">~/team/{handle(person)}</span>
      <span className="hidden truncate text-muted-subtle xl:inline">
        {person.role}
      </span>
      <span className="ml-auto tabular-nums text-muted-subtle">
        {String(index + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}
      </span>
    </>
  );

  return (
    <div
      className="h-full"
      style={interactive ? { perspective: 1400 } : undefined}
    >
      <motion.article
        data-surface="inverse"
        aria-label={`${person.name ?? "Name to come"}, ${person.role}`}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={interactive ? { rotateX, rotateY } : undefined}
        className="group relative flex h-full flex-col rounded-2xl border border-border shadow-[0_-1px_0_rgb(167_196_176/0.12)]"
      >
        <span aria-hidden="true" className="border-light rounded-2xl" />

        {onSelect ? (
          <button
            type="button"
            onClick={onSelect}
            aria-label={`Show ${person.name ?? person.role}`}
            className="flex h-14 shrink-0 cursor-pointer items-center gap-5 rounded-t-2xl border-b border-border px-6 font-mono text-xs outline-none transition-colors hover:bg-surface/60 focus-visible:ring-2 focus-visible:ring-accent/70"
          >
            {tab}
          </button>
        ) : (
          <div className="flex h-14 shrink-0 items-center gap-5 border-b border-border px-6 font-mono text-xs">
            {tab}
          </div>
        )}

        <div
          className={cn(
            "grid min-h-0 flex-1 gap-6 p-6 sm:p-7 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-10 xl:p-8",
          )}
        >
          {/* Portrait or monogram, framed like a drawing with its own dot field */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-surface/60 max-lg:aspect-[16/9]">
            <motion.div
              aria-hidden="true"
              style={interactive ? { x: dotsX, y: dotsY } : undefined}
              className="map-dots absolute -inset-6"
            />
            {[
              "left-3 top-3 border-l border-t",
              "right-3 top-3 border-r border-t",
              "bottom-3 left-3 border-b border-l",
              "bottom-3 right-3 border-b border-r",
            ].map((corner) => (
              <span
                key={corner}
                aria-hidden="true"
                className={cn("absolute size-3 border-accent/50", corner)}
              />
            ))}
            {person.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={person.photo}
                alt={`Portrait of ${person.name ?? person.role}`}
                className="absolute inset-0 h-full w-full object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0"
              />
            ) : (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 grid place-items-center font-display font-medium tracking-[-0.04em]",
                  person.name
                    ? "text-[clamp(4rem,7vw,6.5rem)] text-foreground/90"
                    : "font-mono text-3xl text-muted-subtle",
                )}
              >
                {initials(person.name)}
              </span>
            )}
            <span className="absolute bottom-4 left-5 font-mono text-[11px] text-accent">
              {person.discipline}
            </span>
          </div>

          <div className="flex min-h-0 flex-col">
            <h3
              className={cn(
                "text-3xl font-medium leading-none tracking-[-0.03em] xl:text-[2.6rem]",
                person.name ? "text-foreground" : "text-muted-subtle",
              )}
            >
              {person.name ?? "[ Name ]"}
            </h3>
            <p className="mt-3 text-lg text-muted-foreground">{person.role}</p>

            <dl className="mt-6 grid grid-cols-[auto_minmax(0,1fr)] border-y border-border">
              <div className="py-3.5 pr-6">
                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-subtle">
                  Experience
                </dt>
                <dd className="mt-1 font-display text-2xl font-medium tabular-nums text-foreground">
                  {person.years !== undefined ? (
                    <>
                      {person.years}
                      <span className="text-accent">+</span>{" "}
                      <span className="text-base text-muted-foreground">
                        years
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-subtle">[ 00 ] years</span>
                  )}
                </dd>
              </div>
              <div className="border-l border-border py-3.5 pl-6">
                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-subtle">
                  Previously
                </dt>
                <dd
                  className={cn(
                    "mt-1.5 text-sm leading-6",
                    person.previously ? "text-foreground" : "text-muted-subtle",
                  )}
                >
                  {person.previously ?? "[ companies, sectors or products ]"}
                </dd>
              </div>
            </dl>

            <p
              className={cn(
                "mt-5 text-sm leading-6 text-muted-foreground",
                stacked && "line-clamp-1 [@media(max-height:820px)]:hidden",
              )}
            >
              {person.focus}
            </p>

            <div className="mt-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-subtle">
                Selected work
              </p>
              <ul className="mt-2 space-y-1.5">
                {(
                  person.selectedWork ?? [
                    "[ notable project, client or result ]",
                    "[ notable project, client or result ]",
                  ]
                ).map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className={cn(
                      "flex gap-2.5 text-sm leading-6",
                      person.selectedWork
                        ? "text-foreground"
                        : "text-muted-subtle",
                    )}
                  >
                    <span aria-hidden="true" className="font-mono text-accent">
                      ▹
                    </span>
                    <span className={cn(stacked && "line-clamp-1")}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <ul
              className="mt-auto flex flex-wrap gap-1.5 pt-5"
              aria-label="Works with"
            >
              {person.stack.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-border-strong px-2 py-1 font-mono text-[11px] text-foreground/85 transition-colors duration-300 group-hover:border-accent/40"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
