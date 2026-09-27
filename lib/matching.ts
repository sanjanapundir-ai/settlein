import { Listing, PersonRequirements, RequirementItem } from "./types";
import { PERSON_COUNT, REQUIREMENT_LABELS } from "./constants";

export function normalizePlace(place: string): string {
  return place.trim().toLowerCase();
}

// every distinct commute place named across everyone's requirements, first-seen order
export function getCommutePlaces(
  requirementsList: PersonRequirements[]
): { key: string; label: string }[] {
  const seen = new Map<string, string>();
  for (const person of requirementsList) {
    for (const item of person.items) {
      if (item.type === "maxCommute" && item.commutePlace?.trim()) {
        const key = normalizePlace(item.commutePlace);
        if (!seen.has(key)) seen.set(key, item.commutePlace.trim());
      }
    }
  }
  return Array.from(seen, ([key, label]) => ({ key, label }));
}

export interface CheckResult {
  id: string;
  label: string;
  met: boolean | null; // null = no data to check against
  detail: string;
}

export interface RentCheck {
  share: number;
  max: number | null;
  met: boolean | null;
  detail: string;
}

export function formatRupees(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function checkRentShare(person: PersonRequirements, listing: Listing): RentCheck {
  const share = Math.round(listing.totalRent / PERSON_COUNT);
  if (person.maxRent === null) {
    return { share, max: null, met: null, detail: `Rent share: ${formatRupees(share)} (no budget set)` };
  }
  const diff = share - person.maxRent;
  if (diff > 0) {
    return { share, max: person.maxRent, met: false,
      detail: `Rent share: ${formatRupees(share)}, ${formatRupees(diff)} over your budget` };
  }
  return { share, max: person.maxRent, met: true,
    detail: `Rent share: ${formatRupees(share)}, within your ${formatRupees(person.maxRent)} budget` };
}

export function checkRequirementItem(item: RequirementItem, listing: Listing): CheckResult {
  switch (item.type) {
    case "lift": {
      const needsLift = listing.floor > 1;
      const met = !needsLift || listing.lift;
      const detail = !needsLift ? `Floor ${listing.floor}, no lift needed`
        : listing.lift ? `Floor ${listing.floor} with a lift` : `Floor ${listing.floor} with no lift`;
      return { id: item.id, label: REQUIREMENT_LABELS.lift, met, detail };
    }
    case "parking": {
      const met = listing.parking;
      return { id: item.id, label: REQUIREMENT_LABELS.parking, met, detail: met ? "Dedicated parking available" : "No dedicated parking" };
    }
    case "petFriendly": {
      const met = listing.petFriendly;
      return { id: item.id, label: REQUIREMENT_LABELS.petFriendly, met, detail: met ? "Pet friendly" : "Not pet friendly" };
    }
    case "minBathrooms": {
      const need = item.minBathrooms ?? 0;
      const met = listing.bathrooms >= need;
      const detail = met ? `${listing.bathrooms} bathroom${listing.bathrooms === 1 ? "" : "s"}`
        : `${listing.bathrooms} bathroom${listing.bathrooms === 1 ? "" : "s"}, ${need - listing.bathrooms} short of the ${need} you need`;
      return { id: item.id, label: `At least ${need} bathroom${need === 1 ? "" : "s"}`, met, detail };
    }
    case "maxCommute": {
      const place = item.commutePlace?.trim() || "your place";
      const limit = item.commuteMinutes ?? 0;
      const key = normalizePlace(item.commutePlace ?? "");
      const minutes = listing.commuteTimes[key];
      if (minutes === undefined) {
        return { id: item.id, label: `Commute to ${place} (max ${limit} min)`, met: null, detail: `No commute time recorded for ${place}` };
      }
      const met = minutes <= limit;
      const detail = met ? `${minutes} min to ${place}, within your ${limit} min limit`
        : `${minutes} min to ${place}, ${minutes - limit} min over your limit`;
      return { id: item.id, label: `Commute to ${place} (max ${limit} min)`, met, detail };
    }
  }
}

export interface PersonEvaluation {
  personId: string;
  rent: RentCheck;
  dealbreakers: CheckResult[];
  preferences: CheckResult[];
  missesDealbreaker: boolean;
}

export function evaluateListingForPerson(person: PersonRequirements, listing: Listing): PersonEvaluation {
  const rent = checkRentShare(person, listing);
  const dealbreakers = person.items.filter((i) => i.category === "dealbreaker").map((i) => checkRequirementItem(i, listing));
  const preferences = person.items.filter((i) => i.category === "preference").map((i) => checkRequirementItem(i, listing));
  const missesDealbreaker = rent.met === false || dealbreakers.some((d) => d.met === false);
  return { personId: person.id, rent, dealbreakers, preferences, missesDealbreaker };
}

// plain-language sentences for whichever dealbreakers this listing misses, per person
export function describeMisses(personName: string, evaluation: PersonEvaluation): string[] {
  const sentences: string[] = [];
  if (evaluation.rent.met === false) sentences.push(`${personName}: ${evaluation.rent.detail}.`);
  for (const d of evaluation.dealbreakers) {
    if (d.met === false) sentences.push(`${personName}: ${d.detail}.`);
  }
  return sentences;
}
