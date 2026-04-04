export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      <header className="fixed top-0 w-full z-50 frosted-glass flex items-center px-6 h-16">
        <a href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">
            trophy
          </span>
          <span className="font-headline text-2xl font-bold tracking-tighter text-primary">
            Podium
          </span>
        </a>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-outline-variant/15 to-transparent" />
      </header>
      <main className="flex-grow flex items-center justify-center pt-16 px-4">
        {children}
      </main>
    </div>
  );
}
