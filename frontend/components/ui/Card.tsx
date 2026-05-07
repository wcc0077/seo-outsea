interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden
                     ${hover ? 'hover:shadow-lg hover:border-gray-300 transition-all duration-200' : ''}
                     ${className}`}>
      {children}
    </div>
  );
}
