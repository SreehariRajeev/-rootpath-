import { cn } from "@/lib/utils";

/** The complete `>_rp` mark. The "r" is essential and must never be dropped (see brand book, 02 Logo System). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono font-bold tracking-[-0.02em] text-foreground",
        className,
      )}
    >
      &gt;<span className="text-accent">_</span>rp
    </span>
  );
}

/** Secondary treatment: CLI signature, `>_rp$ start --build --beyond`. */
export function CliSignature({
  className,
  cursor = false,
}: {
  className?: string;
  cursor?: boolean;
}) {
  return (
    <span className={cn("font-mono text-accent", className)}>
      <span>&gt;_rp</span>
      <span className="text-muted-subtle">$</span>
      &nbsp;start --build --beyond
      {cursor ? <span aria-hidden="true" className="cursor" /> : null}
    </span>
  );
}
