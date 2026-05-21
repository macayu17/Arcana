import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "quiet";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border border-amber-500/50 bg-amber-500 text-zinc-950 shadow-[0_20px_40px_-22px_rgba(245,158,11,0.65)] hover:bg-amber-400",
  secondary:
    "border border-zinc-300/70 bg-white text-zinc-950 shadow-[0_20px_40px_-20px_rgba(24,24,27,0.18)] hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-zinc-600",
  ghost:
    "border border-transparent text-zinc-700 hover:bg-zinc-950/5 dark:text-zinc-300 dark:hover:bg-white/5",
  quiet:
    "border border-zinc-200/70 bg-zinc-50 text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300",
};

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold tracking-tight transition duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: ButtonVariant;
  icon?: ReactNode;
};

export function Button({
  className,
  variant = "primary",
  icon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {icon}
      {children}
    </button>
  );
}

export function ButtonLink({
  className,
  variant = "primary",
  icon,
  children,
  href,
  ...props
}: ButtonLinkProps) {
  const external = href.startsWith("http");

  if (external) {
    return (
      <a
        className={cn(base, variants[variant], className)}
        href={href}
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {icon}
        {children}
      </a>
    );
  }

  return (
    <Link className={cn(base, variants[variant], className)} href={href}>
      {icon}
      {children}
    </Link>
  );
}
