import Link from 'next/link';

interface ButtonProps {
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  className?: string;
}

export default function Button({ href, variant = 'primary', children, className = '' }: ButtonProps) {
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
    ghost: 'text-primary-600 hover:text-primary-700 hover:underline',
  };

  const baseClasses = `inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return <button className={baseClasses}>{children}</button>;
}
