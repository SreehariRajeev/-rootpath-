/** The site's shared ease-out. It is the same curve as `--ease-out` in globals.css. */
export const ease = [0.22, 1, 0.36, 1] as const;

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
