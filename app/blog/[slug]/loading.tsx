export default function BlogPostLoading() {
  return (
    <main className="min-h-screen bg-[#030712] px-6 py-16 text-white md:px-10">
      <div className="mx-auto max-w-3xl animate-pulse">
        <div className="h-3 w-28 rounded-full bg-white/10" />
        <div className="mt-8 h-4 w-32 rounded-full bg-white/10" />
        <div className="mt-4 h-12 w-3/4 rounded-2xl bg-white/10" />
        <div className="mt-4 h-4 w-full rounded-full bg-white/10" />
        <div className="mt-2 h-4 w-5/6 rounded-full bg-white/10" />
        <div className="mt-10 space-y-3">
          <div className="h-4 w-full rounded-full bg-white/10" />
          <div className="h-4 w-full rounded-full bg-white/10" />
          <div className="h-4 w-11/12 rounded-full bg-white/10" />
          <div className="h-4 w-full rounded-full bg-white/10" />
          <div className="h-4 w-4/5 rounded-full bg-white/10" />
        </div>
      </div>
    </main>
  );
}
