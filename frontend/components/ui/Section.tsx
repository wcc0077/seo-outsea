interface SectionProps {
  children: React.ReactNode;
  className?: string;
  bg?: 'white' | 'subtle' | 'dark' | 'primary';
}

export default function Section({ children, className = '', bg = 'white' }: SectionProps) {
  const bgClasses = {
    white: 'bg-white',
    subtle: 'bg-neutral-50',
    dark: 'bg-neutral-900 text-white',
    primary: 'bg-primary-900 text-white',
  };

  return (
    <section className={`py-20 ${bgClasses[bg]} ${className}`}>
      {children}
    </section>
  );
}
