import Link from 'next/link';
import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] transition-colors duration-150 ease-out disabled:pointer-events-none disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary: 'bg-rc-blue text-white font-semibold shadow-rc-primary hover:bg-rc-blue-hover',
  secondary: 'bg-rc-surface-3 text-rc-ink font-medium border border-rc-border-strong hover:border-rc-border-hover',
  ghost: 'text-rc-ink-3 font-medium hover:bg-rc-nav-hover hover:text-rc-ink',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13.5px]',
  md: 'px-[22px] py-[14px] text-[15.5px]',
  lg: 'h-12 px-5 text-[15px]',
};

export function buttonClasses({ variant = 'primary', size = 'md', className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={buttonClasses({ variant, size, className })} {...rest}>
      {children}
    </button>
  );
});

type ButtonLinkProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; external?: boolean };

export function ButtonLink({ variant, size, className, children, href, external, ...rest }: ButtonLinkProps) {
  const classes = buttonClasses({ variant, size, className });
  if (external || /^(https?:|mailto:)/.test(href)) {
    return (
      <a href={href} className={classes} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
