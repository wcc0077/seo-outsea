import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-24">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <p className="text-xl text-gray-600 mt-4 mb-8">Page not found</p>
        <Link href="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
}
