"use client";

import { useState } from "react";
import { Check, ExternalLink, HelpCircle, Pencil, Trash2, X } from "lucide-react";
import { Listing, PersonId, PersonRequirements } from "@/lib/types";
import { COLOR_STYLES, PEOPLE, personName } from "@/lib/constants";
import { CheckResult, evaluateListingForPerson, formatRupees } from "@/lib/matching";
import Avatar from "./Avatar";

function StatusIcon({ met }: { met: boolean | null }) {
  if (met === true) return <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500 text-white"><Check className="h-3.5 w-3.5" /></span>;
  if (met === false) return <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white"><X className="h-3.5 w-3.5" /></span>;
  return <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-300 text-white"><HelpCircle className="h-3.5 w-3.5" /></span>;
}

function Line({ label, detail, met }: { label: string; detail: string; met: boolean | null }) {
  const status = met === true ? "met" : met === false ? "not met" : "unknown";
  return (
    <li className="flex gap-2 text-sm">
      <StatusIcon met={met} />
      <div>
        <p className="font-bold leading-tight">{label} <span className="sr-only">({status})</span></p>
        <p className="text-ink/70">{detail}</p>
      </div>
    </li>
  );
}

function Group({ title, items }: { title: string; items: CheckResult[] }) {
  if (!items.length) return null;
  return (
    <div className="mt-3">
      <p className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wider text-ink/50">{title}</p>
      <ul className="space-y-2">
        {items.map((r) => <Line key={r.id} label={r.label} detail={r.detail} met={r.met} />)}
      </ul>
    </div>
  );
}

export default function ListingCard({
  listing,
  requirements,
  selected,
  selectDisabled,
  onToggleSelect,
  onEdit,
  onDelete,
}: {
  listing: Listing;
  requirements: Record<PersonId, PersonRequirements>;
  selected: boolean;
  selectDisabled: boolean;
  onToggleSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const facts = [
    `${formatRupees(listing.totalRent)}/mo total`,
    `${formatRupees(listing.deposit)} deposit`,
    `Floor ${listing.floor}`,
    listing.lift ? "Lift" : "No lift",
    listing.parking ? "Parking" : "No parking",
    listing.petFriendly ? "Pet friendly" : "No pets",
    `${listing.bathrooms} bath`,
  ];

  return (
    <article className={`card-lift animate-pop overflow-hidden rounded-3xl bg-white/95 shadow-fluffy ring-2 ${selected ? "ring-violet-400" : "ring-transparent"}`}>
      {listing.photos.length > 0 && (
        <div className="flex gap-2 overflow-x-auto p-3 pb-0">
          {listing.photos.map((src, i) => (
            <button key={i} type="button" onClick={() => setLightbox(src)} className="shrink-0" aria-label={`Enlarge photo ${i + 1}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${listing.title} photo ${i + 1}`} className="h-28 w-40 rounded-2xl object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-heading text-xl font-bold leading-tight">{listing.title || "Untitled flat"}</h3>
            <p className="text-sm text-ink/60">{listing.area || "Area not set"}</p>
          </div>
          <label className={`flex min-h-[40px] cursor-pointer items-center gap-2 rounded-full px-3 text-sm font-bold ${selected ? "bg-violet-500 text-white" : "bg-violet-50 text-ink"} ${selectDisabled ? "cursor-not-allowed opacity-50" : ""}`}>
            <input type="checkbox" className="h-4 w-4 accent-violet-600" checked={selected} disabled={selectDisabled} onChange={onToggleSelect} />
            Compare
          </label>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {facts.map((f) => (
            <span key={f} className="rounded-full bg-butter/70 px-2.5 py-1 text-xs font-bold">{f}</span>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/60">
          {listing.verifiedBy ? <span>Details checked by {personName(listing.verifiedBy)}</span> : <span className="italic">Details not verified yet.</span>}
          {listing.sourceLink && (
            <a href={listing.sourceLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-violet-600 underline">
              Source <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {PEOPLE.map((p) => {
            const ev = evaluateListingForPerson(requirements[p.id], listing);
            const c = COLOR_STYLES[p.color];
            return (
              <div key={p.id} className={`rounded-2xl border-2 p-3 ${c.border} ${c.bgSoft}`}>
                <div className="mb-2 flex items-center gap-2">
                  <Avatar person={p} size={28} className={`ring-2 ${c.ring}`} />
                  <span className={`font-heading font-bold ${c.text}`}>{p.name}</span>
                </div>
                <ul><Line label="Rent share" detail={ev.rent.detail} met={ev.rent.met} /></ul>
                <Group title="Dealbreakers" items={ev.dealbreakers} />
                <Group title="Preferences" items={ev.preferences} />
                {!ev.dealbreakers.length && !ev.preferences.length && (
                  <p className="mt-2 text-xs italic text-ink/50">No dealbreakers or preferences set.</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap justify-end gap-2">
          {confirmDelete ? (
            <>
              <span className="self-center text-sm font-bold">Delete this flat?</span>
              <button type="button" onClick={onDelete} className="btn-danger">Yes, delete</button>
              <button type="button" onClick={() => setConfirmDelete(false)} className="btn-soft">Cancel</button>
            </>
          ) : (
            <>
              <button type="button" onClick={onEdit} className="btn-soft"><Pencil className="h-4 w-4" /> Edit</button>
              <button type="button" onClick={() => setConfirmDelete(true)} className="btn-soft text-rose-600"><Trash2 className="h-4 w-4" /> Delete</button>
            </>
          )}
        </div>
      </div>

      {lightbox && (
        <div role="dialog" aria-label="Photo" onClick={() => setLightbox(null)} className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/85 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="Enlarged photo" className="max-h-full max-w-full rounded-2xl" />
          <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink"><X className="h-5 w-5" /></span>
        </div>
      )}
    </article>
  );
}
