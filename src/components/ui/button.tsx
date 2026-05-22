import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "quiet";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border border-[rgba(217,119,6,0.52)] bg-[linear-gradient(135deg,rgba(217,119,6,0.18),rgba(217,119,6,0.08))] text-[#f0b46d] shadow-[0_16px_38px_-34px_rgba(217,119,6,0.65)] hover:bg-[rgba(217,119,6,0.22)] hover:text-[#f4c285]",
  secondary:
    "border border-[rgba(229,226,225,0.14)] bg-[rgba(235,231,223,0.025)] text-[var(--text-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-[rgba(217,119,6,0.4)]",
  ghost:
    "border border-transparent text-[var(--text-secondary)] hover:bg-[rgba(235,231,223,0.05)] hover:text-[var(--text-primary)]",
  quiet:
    "border border-[rgba(229,226,225,0.1)] bg-[rgba(13,12,10,0.5)] text-[var(--text-secondary)] hover:border-[rgba(217,119,6,0.4)] hover:text-[var(--text-primary)]",
};

const base =
  "inline-flex min-h-9 items-center justify-center gap-2 rounded-md px-3.5 text-sm font-semibold tracking-tight transition duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

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
