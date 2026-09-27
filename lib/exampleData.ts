import { Listing, PersonId, PersonRequirements } from "./types";
import { makeId } from "./constants";
import { normalizePlace } from "./matching";

export function getExampleRequirements(): Record<PersonId, PersonRequirements> {
  return {
    riya: {
      id: "riya", maxRent: 15000, areas: ["Baner", "Aundh", "Balewadi"], otherArea: "",
      items: [
        { id: makeId(), type: "parking", category: "dealbreaker" },
        { id: makeId(), type: "maxCommute", category: "preference", commutePlace: "Gym", commuteMinutes: 20 },
      ],
    },
    meera: {
      id: "meera", maxRent: 14000, areas: ["Baner", "Wakad"], otherArea: "",
      items: [
        { id: makeId(), type: "lift", category: "dealbreaker" },
        { id: makeId(), type: "petFriendly", category: "preference" },
      ],
    },
    kavita: {
      id: "kavita", maxRent: 16000, areas: ["Hinjewadi", "Wakad", "Balewadi"], otherArea: "",
      items: [
        { id: makeId(), type: "maxCommute", category: "dealbreaker", commutePlace: "Hinjewadi Phase 1", commuteMinutes: 35 },
        { id: makeId(), type: "minBathrooms", category: "preference", minBathrooms: 2 },
      ],
    },
  };
}

export function getExampleListings(): Listing[] {
  const hub = normalizePlace("Hinjewadi Phase 1");
  const gym = normalizePlace("Gym");
  const now = Date.now();
  const base = { sourceLink: "", verifiedBy: null, photos: [] as string[] };
  return [
    { ...base, id: makeId(), createdAt: now, title: "Sunny 3BHK near Balewadi High Street", area: "Balewadi",
      totalRent: 42000, deposit: 100000, floor: 3, lift: true, parking: true, petFriendly: true, bathrooms: 2,
      commuteTimes: { [hub]: 30, [gym]: 15 }, verifiedBy: "riya" },
    { ...base, id: makeId(), createdAt: now + 1, title: "Walk-up 3BHK in Wakad", area: "Wakad",
      totalRent: 39000, deposit: 80000, floor: 3, lift: false, parking: true, petFriendly: false, bathrooms: 2,
      commuteTimes: { [hub]: 35, [gym]: 10 } },
    { ...base, id: makeId(), createdAt: now + 2, title: "Baner high-rise with balcony", area: "Baner",
      totalRent: 42000, deposit: 120000, floor: 5, lift: true, parking: true, petFriendly: true, bathrooms: 3,
      commuteTimes: { [hub]: 50, [gym]: 25 } },
    { ...base, id: makeId(), createdAt: now + 3, title: "Spacious Aundh flat, old building", area: "Aundh",
      totalRent: 48000, deposit: 150000, floor: 4, lift: false, parking: false, petFriendly: true, bathrooms: 2,
      commuteTimes: { [hub]: 65, [gym]: 30 } },
  ];
}
