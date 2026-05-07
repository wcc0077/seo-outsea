import Link from 'next/link';

interface ButtonProps {
  href?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  children: React.ReactNode;
  className?: string;
}

export default function Button({ href, variant = 'primary', children, className = '' }: ButtonProps) {
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-700/30',
    secondary: 'border-2 border-primary-200 text-primary-700 bg-white hover:bg-primary-50 hover:border-primary-400',
    accent: 'bg-accent-500 text-neutral-900 hover:bg-accent-400 shadow-lg shadow-accent-500/25 hover:shadow-xl hover:shadow-accent-400/30',
    ghost: 'text-primary-600 hover:text-primary-700 hover:underline',
  };

  const baseClasses = `inline-flex items-center justify-center px-7 py-3 text-sm font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return <button className={baseClasses}>{children}</button>;
}
