"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Listing, PersonId, PersonRequirements } from "@/lib/types";
import { PEOPLE, makeId } from "@/lib/constants";
import { getCommutePlaces } from "@/lib/matching";
import { readAndCompressImage } from "@/lib/image";

interface Draft {
  title: string;
  area: string;
  totalRent: string;
  deposit: string;
  floor: string;
  lift: boolean;
  parking: boolean;
  petFriendly: boolean;
  bathrooms: string;
  sourceLink: string;
  commuteTimes: Record<string, string>;
  verifiedBy: PersonId | null;
  photos: string[];
}

function toDraft(l?: Listing): Draft {
  return {
    title: l?.title ?? "",
    area: l?.area ?? "",
    totalRent: l ? String(l.totalRent) : "",
    deposit: l ? String(l.deposit) : "",
    floor: l ? String(l.floor) : "",
    lift: l?.lift ?? false,
    parking: l?.parking ?? false,
    petFriendly: l?.petFriendly ?? false,
    bathrooms: l ? String(l.bathrooms) : "",
    sourceLink: l?.sourceLink ?? "",
    commuteTimes: Object.fromEntries(Object.entries(l?.commuteTimes ?? {}).map(([k, v]) => [k, String(v)])),
    verifiedBy: l?.verifiedBy ?? null,
    photos: l?.photos ?? [],
  };
}

function YesNo({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex rounded-full bg-violet-50 p-1">
        {[true, false].map((v) => (
          <button
            key={String(v)}
            type="button"
            aria-pressed={value === v}
            onClick={() => onChange(v)}
            className={`min-h-[36px] flex-1 rounded-full text-sm font-bold transition ${value === v ? "bg-violet-500 text-white shadow" : "text-ink/60"}`}
          >
            {v ? "Yes" : "No"}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ListingForm({
  initial,
  requirements,
  onSave,
  onCancel,
}: {
  initial?: Listing;
  requirements: Record<PersonId, PersonRequirements>;
  onSave: (listing: Listing) => void;
  onCancel: () => void;
}) {
  const [d, setD] = useState<Draft>(() => toDraft(initial));
  const [busy, setBusy] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const places = getCommutePlaces(PEOPLE.map((p) => requirements[p.id]));
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((prev) => ({ ...prev, [k]: v }));
  const num = (s: string) => (Number.isFinite(Number(s)) ? Number(s) : 0);

  const addPhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setPhotoError("");
    const added: string[] = [];
    for (const f of Array.from(files)) {
      try {
        added.push(await readAndCompressImage(f));
      } catch {
        setPhotoError("One of the photos couldn't be read.");
      }
    }
    setD((prev) => ({ ...prev, photos: [...prev.photos, ...added] }));
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const commuteTimes: Record<string, number> = {};
    for (const [k, v] of Object.entries(d.commuteTimes)) if (v.trim() !== "") commuteTimes[k] = num(v);
    onSave({
      id: initial?.id ?? makeId(),
      createdAt: initial?.createdAt ?? Date.now(),
      title: d.title.trim(),
      area: d.area.trim(),
      totalRent: num(d.totalRent),
      deposit: num(d.deposit),
      floor: num(d.floor),
      lift: d.lift,
      parking: d.parking,
      petFriendly: d.petFriendly,
      bathrooms: num(d.bathrooms),
      sourceLink: d.sourceLink.trim(),
      commuteTimes,
      verifiedBy: d.verifiedBy,
      photos: d.photos,
    });
  };

  return (
    <form onSubmit={submit} className="animate-pop rounded-3xl border-2 border-violet-100 bg-white/95 p-5 shadow-fluffy sm:p-6">
      <h3 className="mb-4 font-heading text-2xl font-bold">{initial ? "Edit flat" : "Add a flat"}</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="l-title">Title</label>
          <input id="l-title" required className="field" placeholder="e.g. 3BHK near the park" value={d.title} onChange={(e) => set("title", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="l-area">Area</label>
          <input id="l-area" className="field" placeholder="e.g. Baner" value={d.area} onChange={(e) => set("area", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="l-rent">Total monthly rent (₹)</label>
          <input id="l-rent" required type="number" min={0} inputMode="numeric" className="field" value={d.totalRent} onChange={(e) => set("totalRent", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="l-dep">Security deposit (₹)</label>
          <input id="l-dep" type="number" min={0} inputMode="numeric" className="field" value={d.deposit} onChange={(e) => set("deposit", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="l-floor">Floor</label>
            <input id="l-floor" type="number" min={0} inputMode="numeric" className="field" value={d.floor} onChange={(e) => set("floor", e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="l-bath">Bathrooms</label>
            <input id="l-bath" type="number" min={0} inputMode="numeric" className="field" value={d.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} />
          </div>
        </div>
        <YesNo label="Lift" value={d.lift} onChange={(v) => set("lift", v)} />
        <YesNo label="Dedicated parking" value={d.parking} onChange={(v) => set("parking", v)} />
        <YesNo label="Pet friendly" value={d.petFriendly} onChange={(v) => set("petFriendly", v)} />
        <div>
          <label className="label" htmlFor="l-ver">Details checked by</label>
          <select
            id="l-ver"
            className="field"
            value={d.verifiedBy ?? ""}
            onChange={(e) => set("verifiedBy", (e.target.value || null) as PersonId | null)}
          >
            <option value="">Not checked yet</option>
            {PEOPLE.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="l-link">Source link (optional)</label>
          <input id="l-link" type="url" className="field" placeholder="https://…" value={d.sourceLink} onChange={(e) => set("sourceLink", e.target.value)} />
        </div>
      </div>

      {places.length > 0 && (
        <div className="mt-5">
          <p className="label">Commute times from this flat</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {places.map((p) => (
              <div key={p.key} className="relative">
                <label className="sr-only" htmlFor={`c-${p.key}`}>Minutes to {p.label}</label>
                <span className="pointer-events-none absolute left-3 top-1/2 max-w-[55%] -translate-y-1/2 truncate text-sm font-bold text-ink/70">{p.label}</span>
                <input
                  id={`c-${p.key}`}
                  type="number"
                  min={0}
                  inputMode="numeric"
                  className="field pl-[60%] pr-12 text-right"
                  value={d.commuteTimes[p.key] ?? ""}
                  onChange={(e) => set("commuteTimes", { ...d.commuteTimes, [p.key]: e.target.value })}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink/50">min</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5">
        <p className="label">Photos</p>
        <div className="flex flex-wrap gap-3">
          {d.photos.map((src, i) => (
            <div key={i} className="relative h-20 w-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Photo ${i + 1}`} className="h-20 w-20 rounded-2xl object-cover" />
              <button
                type="button"
                aria-label={`Remove photo ${i + 1}`}
                onClick={() => set("photos", d.photos.filter((_, j) => j !== i))}
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white shadow"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-200 text-xs font-bold text-violet-500 hover:bg-violet-50"
          >
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
            Add
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => addPhotos(e.target.files)} />
        </div>
        {photoError && <p className="mt-2 text-sm text-rose-600">{photoError}</p>}
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="btn-soft">Cancel</button>
        <button type="submit" disabled={busy} className="btn-primary">{initial ? "Save changes" : "Save flat"}</button>
      </div>
    </form>
  );
}
