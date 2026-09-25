export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-rc-bg p-4">
      <div className="w-full max-w-md rounded-rc-card-lg border border-rc-border-card bg-rc-surface p-6 text-center md:p-8">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-rc-border-strong border-t-rc-blue-link"></div>
        <h1 className="mb-2 text-rc-h1-m font-semibold text-rc-ink">
          Preparando seu download
        </h1>
        <p className="text-rc-body text-rc-ink-3">
          Por favor, aguarde enquanto preparamos seu ebook...
        </p>
      </div>
    </div>
  );
} 