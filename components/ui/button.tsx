"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = {
  primary:
    "border-accent bg-accent text-accent-foreground hover:-translate-y-px hover:bg-accent-strong hover:shadow-[0_10px_24px_rgb(var(--accent-rgb)/0.18)]",
  secondary:
    "border-border-strong bg-surface-elevated text-foreground hover:border-accent/60 hover:bg-surface",
  outline:
    "border-border-strong bg-transparent text-foreground hover:border-accent/60 hover:bg-surface",
  ghost:
    "border-transparent bg-transparent text-muted-foreground hover:border-border hover:text-foreground",
} as const;

const buttonSizes = {
  sm: "h-9 px-3.5 text-xs",
  default: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-sm",
  icon: "size-11 text-sm",
} as const;

type ButtonNativeProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onAnimationStart"
  | "onDrag"
  | "onDragEnd"
  | "onDragStart"
>;

export interface ButtonProps extends ButtonNativeProps {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          "inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border font-medium tracking-[-0.01em] outline-none transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-45",
          buttonVariants[variant],
          buttonSizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
