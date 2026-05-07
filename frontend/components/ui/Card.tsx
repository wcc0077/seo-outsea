interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-neutral-200/80 overflow-hidden
                     ${hover ? 'hover:shadow-xl hover:shadow-neutral-900/5 hover:border-neutral-300 hover:-translate-y-1 transition-all duration-300' : ''}
                     ${className}`}>
      {children}
    </div>
  );
}
