import { PersonId, PersonMeta, PersonRequirements, RequirementType } from "./types";

export const STORAGE_KEY = "settlein-state-v1";

export const PEOPLE: PersonMeta[] = [
  { id: "riya", name: "Riya", color: "sky",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=Riya-cloud&backgroundColor=bae6fd" },
  { id: "meera", name: "Meera", color: "rose",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=Meera-petal&backgroundColor=fecdd3" },
  { id: "kavita", name: "Kavita", color: "teal",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=Kavita-fern&backgroundColor=99f6e4" },
];

export const PERSON_COUNT = PEOPLE.length;

export function personName(id: PersonId): string {
  return PEOPLE.find((p) => p.id === id)?.name ?? id;
}

export const COLOR_STYLES: Record<string, { ring: string; bg: string; bgSoft: string; text: string; chip: string; border: string; solid: string }> = {
  sky:  { ring: "ring-sky-300", bg: "bg-sky-100", bgSoft: "bg-sky-50", text: "text-sky-700", chip: "bg-sky-200 text-sky-800", border: "border-sky-200", solid: "bg-sky-300" },
  rose: { ring: "ring-rose-300", bg: "bg-rose-100", bgSoft: "bg-rose-50", text: "text-rose-700", chip: "bg-rose-200 text-rose-800", border: "border-rose-200", solid: "bg-rose-300" },
  teal: { ring: "ring-teal-300", bg: "bg-teal-100", bgSoft: "bg-teal-50", text: "text-teal-700", chip: "bg-teal-200 text-teal-800", border: "border-teal-200", solid: "bg-teal-300" },
};

export const AREA_OPTIONS = [
  "Hinjewadi",
  "Wakad",
  "Baner",
  "Aundh",
  "Balewadi",
  "Pimple Saudagar",
  "Kothrud",
  "Viman Nagar",
  "Kharadi",
  "Koregaon Park",
];

export const REQUIREMENT_LABELS: Record<RequirementType, string> = {
  lift: "Lift if above 1st floor",
  parking: "Dedicated parking",
  petFriendly: "Pet friendly",
  minBathrooms: "Minimum bathrooms",
  maxCommute: "Maximum commute",
};

export function emptyRequirements(id: PersonId): PersonRequirements {
  return { id, maxRent: null, areas: [], otherArea: "", items: [] };
}

export function emptyAllRequirements(): Record<PersonId, PersonRequirements> {
  return {
    riya: emptyRequirements("riya"),
    meera: emptyRequirements("meera"),
    kavita: emptyRequirements("kavita"),
  };
}

export function makeId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
