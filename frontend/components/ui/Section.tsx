interface SectionProps {
  children: React.ReactNode;
  className?: string;
  bg?: 'white' | 'gray' | 'primary';
}

export default function Section({ children, className = '', bg = 'white' }: SectionProps) {
  const bgClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    primary: 'bg-primary-600 text-white',
  };

  return (
    <section className={`py-16 ${bgClasses[bg]} ${className}`}>
      {children}
    </section>
  );
}
