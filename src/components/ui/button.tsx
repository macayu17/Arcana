import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "quiet";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border border-[rgba(196,107,40,0.55)] bg-[var(--accent)] text-[#130f0a] shadow-[0_20px_50px_-28px_rgba(196,107,40,0.75)] hover:bg-[#d17a35]",
  secondary:
    "border border-[var(--border-card)] bg-[rgba(247,240,228,0.035)] text-[var(--text-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-[rgba(196,107,40,0.45)]",
  ghost:
    "border border-transparent text-[var(--text-secondary)] hover:bg-[rgba(247,240,228,0.055)] hover:text-[var(--text-primary)]",
  quiet:
    "border border-[var(--border-card)] bg-[rgba(14,13,10,0.62)] text-[var(--text-secondary)] hover:border-[rgba(196,107,40,0.45)] hover:text-[var(--text-primary)]",
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
