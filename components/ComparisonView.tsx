"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, ClipboardCopy, Columns3 } from "lucide-react";
import { Listing, PersonId, PersonRequirements } from "@/lib/types";
import { PEOPLE } from "@/lib/constants";
import { describeMisses, evaluateListingForPerson } from "@/lib/matching";
import { buildSummary } from "@/lib/summary";
import ListingCard from "./ListingCard";

const MAX_SELECTED = 3;

export default function ComparisonView({
  listings,
  requirements,
  selectedIds,
  onToggleSelect,
  onClearSelection,
  onEdit,
  onDelete,
}: {
  listings: Listing[];
  requirements: Record<PersonId, PersonRequirements>;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onClearSelection: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [copyStatus, setCopyStatus] = useState<"" | "copied" | "failed">("");
  const ordered = [...listings].sort((a, b) => a.createdAt - b.createdAt);
  const withReasons = ordered.map((l) => ({
    listing: l,
    reasons: PEOPLE.flatMap((p) => describeMisses(p.name, evaluateListingForPerson(requirements[p.id], l))),
  }));
  const meets = withReasons.filter((x) => x.reasons.length === 0);
  const misses = withReasons.filter((x) => x.reasons.length > 0);
  const selected = ordered.filter((l) => selectedIds.includes(l.id));
  const showSideBySide = selected.length >= 2;

  const copySummary = async () => {
    const text = buildSummary(showSideBySide ? selected : ordered, requirements);
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
    setTimeout(() => setCopyStatus(""), 2500);
  };

  const card = (l: Listing) => (
    <ListingCard
      key={l.id}
      listing={l}
      requirements={requirements}
      selected={selectedIds.includes(l.id)}
      selectDisabled={!selectedIds.includes(l.id) && selectedIds.length >= MAX_SELECTED}
      onToggleSelect={() => onToggleSelect(l.id)}
      onEdit={() => onEdit(l.id)}
      onDelete={() => onDelete(l.id)}
    />
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink/70">
          Tick <span className="font-bold">Compare</span> on 2–3 flats to see them side by side.
        </p>
        <div className="flex items-center gap-3">
          <span aria-live="polite" className="text-sm font-bold text-ink/70">
            {copyStatus === "copied" ? "Copied!" : copyStatus === "failed" ? "Couldn't access the clipboard" : ""}
          </span>
          <button type="button" onClick={copySummary} className="btn-soft">
            <ClipboardCopy className="h-4 w-4 text-violet-500" />
            Copy summary{showSideBySide ? ` (${selected.length} selected)` : ""}
          </button>
        </div>
      </div>

      {showSideBySide && (
        <section id="side-by-side">
          <h3 className="mb-4 flex items-center gap-2 font-heading text-2xl font-bold">
            <Columns3 className="h-6 w-6 text-violet-500" /> Side by side
          </h3>
          <div className={`grid gap-5 ${selected.length === 3 ? "xl:grid-cols-3" : ""} lg:grid-cols-2`}>
            {selected.map(card)}
          </div>
        </section>
      )}

      <section>
        <h3 className="mb-4 flex items-center gap-2 font-heading text-2xl font-bold">
          <CheckCircle2 className="h-6 w-6 text-teal-500" /> Meets everyone&apos;s dealbreakers
          <span className="rounded-full bg-teal-100 px-2.5 text-base text-teal-700">{meets.length}</span>
        </h3>
        {meets.length === 0 ? (
          <p className="rounded-3xl bg-white/60 p-5 text-sm text-ink/60">None of the flats so far pass everyone&apos;s dealbreakers.</p>
        ) : (
          <div className="space-y-5">{meets.map((x) => card(x.listing))}</div>
        )}
      </section>

      <section>
        <h3 className="mb-4 flex items-center gap-2 font-heading text-2xl font-bold">
          <AlertCircle className="h-6 w-6 text-rose-500" /> Misses at least one dealbreaker
          <span className="rounded-full bg-rose-100 px-2.5 text-base text-rose-700">{misses.length}</span>
        </h3>
        {misses.length === 0 ? (
          <p className="rounded-3xl bg-white/60 p-5 text-sm text-ink/60">No flats here.</p>
        ) : (
          <div className="space-y-6">
            {misses.map((x) => (
              <div key={x.listing.id}>
                <ul className="mb-2 space-y-1 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
                  {x.reasons.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
                {card(x.listing)}
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedIds.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 p-3 sm:p-4">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-3 rounded-full bg-ink px-4 py-2 text-white shadow-fluffy">
            <span className="text-sm font-bold">{selectedIds.length} of {MAX_SELECTED} picked to compare</span>
            <div className="flex gap-2">
              {showSideBySide && (
                <a href="#side-by-side" className="btn min-h-[40px] bg-white/15 text-white hover:bg-white/25">View</a>
              )}
              <button type="button" onClick={onClearSelection} className="btn min-h-[40px] bg-white text-ink">Clear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
