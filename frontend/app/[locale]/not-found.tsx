import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-32">
      <div className="text-center">
        <div className="w-12 h-0.5 bg-primary-500 mx-auto mb-8" />
        <h1 className="text-8xl font-bold text-neutral-900 mb-4">404</h1>
        <p className="text-xl text-neutral-500 mb-10">Page not found</p>
        <Link href="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
}
