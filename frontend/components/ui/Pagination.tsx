import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  locale: string;
}

export default function Pagination({ currentPage, totalPages, basePath, locale }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
      {currentPage > 1 && (
        <Link
          href={`/${locale}${basePath}?page=${currentPage - 1}`}
          className="px-4 py-2 text-sm font-medium border border-neutral-300 rounded-lg hover:bg-neutral-50 hover:border-neutral-400 hover:-translate-y-0.5 transition-all duration-200 text-neutral-700"
        >
          &larr; Previous
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={`/${locale}${basePath}?page=${page}`}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            page === currentPage
              ? 'bg-primary-600 text-white shadow-md shadow-primary-600/25'
              : 'border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 hover:-translate-y-0.5 text-neutral-700'
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={`/${locale}${basePath}?page=${currentPage + 1}`}
          className="px-4 py-2 text-sm font-medium border border-neutral-300 rounded-lg hover:bg-neutral-50 hover:border-neutral-400 hover:-translate-y-0.5 transition-all duration-200 text-neutral-700"
        >
          Next &rarr;
        </Link>
      )}
    </nav>
  );
}
