"use client";

import { Plus, Trash2 } from "lucide-react";
import { PersonMeta, PersonRequirements, RequirementCategory, RequirementItem, RequirementType } from "@/lib/types";
import { AREA_OPTIONS, COLOR_STYLES, REQUIREMENT_LABELS, makeId } from "@/lib/constants";
import Avatar from "./Avatar";

type Choice = "none" | RequirementCategory;

const SINGLETONS: RequirementType[] = ["lift", "parking", "petFriendly", "minBathrooms"];

function Toggle({ value, onChange, allowNone = true }: { value: Choice; onChange: (v: Choice) => void; allowNone?: boolean }) {
  const opts: { v: Choice; label: string; on: string }[] = [
    ...(allowNone ? [{ v: "none" as Choice, label: "Not needed", on: "bg-white text-ink shadow" }] : []),
    { v: "dealbreaker", label: "Dealbreaker", on: "bg-rose-500 text-white shadow" },
    { v: "preference", label: "Preference", on: "bg-violet-500 text-white shadow" },
  ];
  return (
    <div className="flex w-full rounded-full bg-violet-50 p-1" role="radiogroup">
      {opts.map((o) => (
        <button
          key={o.v}
          type="button"
          role="radio"
          aria-checked={value === o.v}
          onClick={() => onChange(o.v)}
          className={`min-h-[36px] flex-1 rounded-full px-2 text-xs font-bold transition ${value === o.v ? o.on : "text-ink/60 hover:text-ink"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function PersonRequirementCard({
  person,
  value,
  onChange,
}: {
  person: PersonMeta;
  value: PersonRequirements;
  onChange: (next: PersonRequirements) => void;
}) {
  const c = COLOR_STYLES[person.color];
  const itemOf = (type: RequirementType) => value.items.find((i) => i.type === type);

  const setSingleton = (type: RequirementType, choice: Choice) => {
    const existing = itemOf(type);
    let items = value.items.filter((i) => i.type !== type);
    if (choice !== "none") {
      const next: RequirementItem = existing
        ? { ...existing, category: choice }
        : { id: makeId(), type, category: choice, ...(type === "minBathrooms" ? { minBathrooms: 2 } : {}) };
      items = [...items, next];
    }
    onChange({ ...value, items });
  };

  const patchItem = (id: string, patch: Partial<RequirementItem>) =>
    onChange({ ...value, items: value.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) });

  const commutes = value.items.filter((i) => i.type === "maxCommute");

  const toggleArea = (area: string) =>
    onChange({ ...value, areas: value.areas.includes(area) ? value.areas.filter((a) => a !== area) : [...value.areas, area] });

  return (
    <div className={`card-lift animate-pop rounded-3xl border-2 bg-white/90 p-5 shadow-fluffy ${c.border}`}>
      <div className="mb-4 flex items-center gap-3">
        <Avatar person={person} size={48} className={`ring-4 ${c.ring}`} />
        <div>
          <span className={`rounded-full px-3 py-1 font-heading text-lg font-bold ${c.chip}`}>{person.name}</span>
        </div>
      </div>

      <label className="label" htmlFor={`rent-${person.id}`}>Max rent I can pay (my share, ₹/month)</label>
      <input
        id={`rent-${person.id}`}
        type="number"
        inputMode="numeric"
        min={0}
        className="field"
        placeholder="e.g. 15000"
        value={value.maxRent ?? ""}
        onChange={(e) => onChange({ ...value, maxRent: e.target.value === "" ? null : Number(e.target.value) || 0 })}
      />

      <p className="label mt-4">Areas I&apos;m okay with</p>
      <div className="flex flex-wrap gap-2">
        {AREA_OPTIONS.map((a) => {
          const on = value.areas.includes(a);
          return (
            <button
              key={a}
              type="button"
              aria-pressed={on}
              onClick={() => toggleArea(a)}
              className={`min-h-[36px] rounded-full px-3 text-xs font-bold transition ${on ? c.chip : "bg-violet-50 text-ink/60 hover:text-ink"}`}
            >
              {a}
            </button>
          );
        })}
      </div>
      <input
        className="field mt-2"
        placeholder="Other area (optional)"
        value={value.otherArea}
        onChange={(e) => onChange({ ...value, otherArea: e.target.value })}
      />

      <p className="label mt-5">Dealbreakers &amp; preferences</p>
      <div className="space-y-3">
        {SINGLETONS.map((type) => {
          const item = itemOf(type);
          return (
            <div key={type} className={`rounded-2xl p-3 ${c.bgSoft}`}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-bold">{REQUIREMENT_LABELS[type]}</span>
                {type === "minBathrooms" && item && (
                  <input
                    type="number"
                    min={1}
                    inputMode="numeric"
                    aria-label="Minimum bathrooms"
                    className="field w-20 py-1.5"
                    value={item.minBathrooms ?? ""}
                    onChange={(e) => patchItem(item.id, { minBathrooms: Number(e.target.value) || 0 })}
                  />
                )}
              </div>
              <Toggle value={item?.category ?? "none"} onChange={(v) => setSingleton(type, v)} />
            </div>
          );
        })}

        {commutes.map((item) => (
          <div key={item.id} className={`rounded-2xl p-3 ${c.bgSoft}`}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold">Maximum commute</span>
              <button
                type="button"
                aria-label="Remove commute limit"
                onClick={() => onChange({ ...value, items: value.items.filter((i) => i.id !== item.id) })}
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink/50 hover:bg-white hover:text-rose-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-2 flex gap-2">
              <input
                className="field flex-1"
                placeholder="Place, e.g. office"
                value={item.commutePlace ?? ""}
                onChange={(e) => patchItem(item.id, { commutePlace: e.target.value })}
              />
              <div className="relative w-24">
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  aria-label="Max minutes"
                  className="field pr-9"
                  value={item.commuteMinutes ?? ""}
                  onChange={(e) => patchItem(item.id, { commuteMinutes: Number(e.target.value) || 0 })}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink/50">min</span>
              </div>
            </div>
            <Toggle allowNone={false} value={item.category} onChange={(v) => v !== "none" && patchItem(item.id, { category: v })} />
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            onChange({
              ...value,
              items: [...value.items, { id: makeId(), type: "maxCommute", category: "dealbreaker", commutePlace: "", commuteMinutes: 30 }],
            })
          }
          className="btn-soft w-full"
        >
          <Plus className="h-4 w-4" /> Add a commute limit
        </button>
      </div>
    </div>
  );
}
