export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-bg px-6 text-center">
      <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-brand-blue/20" />
      <p className="mt-4 text-sm text-brand-muted">Loading...</p>
    </div>
  );
}
