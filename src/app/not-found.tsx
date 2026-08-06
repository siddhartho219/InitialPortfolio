import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-bg px-4 text-center">
      <p className="font-mono text-6xl font-bold text-brand-blue sm:text-8xl">
        404
      </p>
      <h1 className="mt-4 font-heading text-2xl font-semibold text-brand-text sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-brand-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 text-brand-blue underline-offset-4 transition-colors hover:text-brand-glow hover:underline"
      >
        Back to home
      </Link>
    </main>
  );
}
