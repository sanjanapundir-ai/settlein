import { Home } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="animate-pop rounded-3xl border-2 border-dashed border-violet-200 bg-white/70 p-10 text-center">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-butter">
        <Home className="h-7 w-7 text-ink" />
      </div>
      <p className="font-heading text-xl font-bold">No flats yet!</p>
      <p className="mt-1 text-sm text-ink/70">Add a flat you&apos;ve seen, or load the example listings to try things out.</p>
    </div>
  );
}
