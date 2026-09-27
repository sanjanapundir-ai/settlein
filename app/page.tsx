"use client";

import { useEffect, useState } from "react";
import { AppState, Listing, PersonId, PersonRequirements } from "@/lib/types";
import { emptyAllRequirements, emptyRequirements, PEOPLE } from "@/lib/constants";
import { safeClear, safeLoad, safeSave } from "@/lib/storage";
import { getExampleListings, getExampleRequirements } from "@/lib/exampleData";
import Header from "@/components/Header";
import DecorativeBackground from "@/components/DecorativeBackground";
import SectionDivider from "@/components/SectionDivider";
import RequirementsSection from "@/components/RequirementsSection";
import ListingsToolbar from "@/components/ListingsToolbar";
import ListingForm from "@/components/ListingForm";
import ComparisonView from "@/components/ComparisonView";
import EmptyState from "@/components/EmptyState";

function initialState(): AppState {
  return { requirements: emptyAllRequirements(), listings: [], selectedListingIds: [] };
}

// normalize whatever shape was saved so older data never crashes the app
function normalize(stored: Partial<AppState> | null): AppState {
  if (!stored) return initialState();
  const requirements = emptyAllRequirements();
  for (const p of PEOPLE) {
    const r = stored.requirements?.[p.id];
    if (r) requirements[p.id] = { ...emptyRequirements(p.id), ...r, items: r.items ?? [], areas: r.areas ?? [] };
  }
  const listings = (stored.listings ?? []).map((l) => ({
    ...l,
    photos: l.photos ?? [],
    commuteTimes: l.commuteTimes ?? {},
    verifiedBy: l.verifiedBy ?? null,
    createdAt: l.createdAt ?? 0,
  }));
  const ids = new Set(listings.map((l) => l.id));
  const selectedListingIds = (stored.selectedListingIds ?? []).filter((id) => ids.has(id)).slice(0, 3);
  return { requirements, listings, selectedListingIds };
}

export default function Page() {
  const [state, setState] = useState<AppState>(initialState);
  const [loaded, setLoaded] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [editing, setEditing] = useState<"new" | string | null>(null);

  useEffect(() => {
    setState(normalize(safeLoad()));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) setSaveFailed(!safeSave(state));
  }, [state, loaded]);

  const updateRequirements = (id: PersonId, next: PersonRequirements) =>
    setState((s) => ({ ...s, requirements: { ...s.requirements, [id]: next } }));

  const saveListing = (listing: Listing) => {
    setState((s) => {
      const exists = s.listings.some((l) => l.id === listing.id);
      return { ...s, listings: exists ? s.listings.map((l) => (l.id === listing.id ? listing : l)) : [...s.listings, listing] };
    });
    setEditing(null);
  };

  const deleteListing = (id: string) => {
    setState((s) => ({
      ...s,
      listings: s.listings.filter((l) => l.id !== id),
      selectedListingIds: s.selectedListingIds.filter((x) => x !== id),
    }));
    if (editing === id) setEditing(null);
  };

  const toggleSelect = (id: string) =>
    setState((s) => {
      if (s.selectedListingIds.includes(id)) return { ...s, selectedListingIds: s.selectedListingIds.filter((x) => x !== id) };
      if (s.selectedListingIds.length >= 3) return s;
      return { ...s, selectedListingIds: [...s.selectedListingIds, id] };
    });

  const clearAll = () => {
    safeClear();
    setState(initialState());
    setEditing(null);
  };

  const editingListing = editing && editing !== "new" ? state.listings.find((l) => l.id === editing) : undefined;

  return (
    <>
      <DecorativeBackground />
      <main className="mx-auto max-w-6xl px-4 pb-28 sm:px-6">
        <Header />
        {saveFailed && (
          <p className="mx-auto mt-4 max-w-xl rounded-2xl bg-amber-100 px-4 py-2 text-center text-sm font-semibold text-amber-800">
            Couldn&apos;t save to this browser (storage may be full — try removing some photos).
          </p>
        )}

        <SectionDivider />
        <RequirementsSection
          requirements={state.requirements}
          onChange={updateRequirements}
          onLoadExample={() => setState((s) => ({ ...s, requirements: getExampleRequirements() }))}
        />

        <SectionDivider />
        <section id="flats" className="scroll-mt-4 space-y-6">
          <div>
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">Flats we&apos;re looking at</h2>
            <p className="text-sm text-ink/70">Shown in the order they were added.</p>
          </div>
          <ListingsToolbar
            onAdd={() => setEditing("new")}
            onLoadExamples={() => setState((s) => ({ ...s, listings: getExampleListings(), selectedListingIds: [] }))}
            onClearAll={clearAll}
          />
          {editing && (
            <ListingForm
              key={editing}
              initial={editingListing}
              requirements={state.requirements}
              onSave={saveListing}
              onCancel={() => setEditing(null)}
            />
          )}
          {state.listings.length === 0 ? (
            <EmptyState />
          ) : (
            <ComparisonView
              listings={state.listings}
              requirements={state.requirements}
              selectedIds={state.selectedListingIds}
              onToggleSelect={toggleSelect}
              onClearSelection={() => setState((s) => ({ ...s, selectedListingIds: [] }))}
              onEdit={(id) => {
                setEditing(id);
                if (typeof window !== "undefined") window.scrollTo({ top: document.getElementById("flats")?.offsetTop ?? 0, behavior: "smooth" });
              }}
              onDelete={deleteListing}
            />
          )}
        </section>
      </main>
    </>
  );
}
