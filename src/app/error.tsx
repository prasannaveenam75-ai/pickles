"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="font-display text-8xl font-bold text-red/20">!</p>
        <h1 className="font-display text-3xl font-bold mt-4 mb-2">Something went wrong</h1>
        <p className="text-charcoal-light mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <button onClick={reset} className="btn-primary">
          Try Again
        </button>
      </div>
    </div>
  );
}
