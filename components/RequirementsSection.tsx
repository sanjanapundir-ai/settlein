"use client";

import { Sparkles } from "lucide-react";
import { PersonId, PersonRequirements } from "@/lib/types";
import { PEOPLE } from "@/lib/constants";
import PersonRequirementCard from "./PersonRequirementCard";

export default function RequirementsSection({
  requirements,
  onChange,
  onLoadExample,
}: {
  requirements: Record<PersonId, PersonRequirements>;
  onChange: (id: PersonId, next: PersonRequirements) => void;
  onLoadExample: () => void;
}) {
  return (
    <section>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">What each of us needs</h2>
          <p className="text-sm text-ink/70">Dealbreakers rule a flat out. Preferences are nice to have.</p>
        </div>
        <button type="button" onClick={onLoadExample} className="btn-soft">
          <Sparkles className="h-4 w-4 text-violet-500" /> Load example
        </button>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {PEOPLE.map((p) => (
          <PersonRequirementCard key={p.id} person={p} value={requirements[p.id]} onChange={(next) => onChange(p.id, next)} />
        ))}
      </div>
    </section>
  );
}
