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
    <nav className="flex items-center justify-center gap-2 mt-12">
      {currentPage > 1 && (
        <Link
          href={`/${locale}${basePath}?page=${currentPage - 1}`}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          &larr; Previous
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={`/${locale}${basePath}?page=${page}`}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            page === currentPage
              ? 'bg-primary-600 text-white'
              : 'border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={`/${locale}${basePath}?page=${currentPage + 1}`}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Next &rarr;
        </Link>
      )}
    </nav>
  );
}
