export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-display text-8xl font-bold text-green/20">404</p>
        <h1 className="font-display text-3xl font-bold mt-4 mb-2">Page Not Found</h1>
        <p className="text-charcoal-light mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <a href="/" className="btn-primary">Go Home</a>
      </div>
    </div>
  );
}
