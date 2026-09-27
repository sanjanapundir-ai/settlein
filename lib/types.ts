export type PersonId = "riya" | "meera" | "kavita";

export type PersonColor = "sky" | "rose" | "teal";

export interface PersonMeta {
  id: PersonId;
  name: string;
  color: PersonColor;
  avatarUrl: string;
}

export type RequirementCategory = "dealbreaker" | "preference";

export type RequirementType =
  | "lift"
  | "parking"
  | "petFriendly"
  | "minBathrooms"
  | "maxCommute";

export interface RequirementItem {
  id: string;
  type: RequirementType;
  category: RequirementCategory;
  minBathrooms?: number;   // used by "minBathrooms"
  commutePlace?: string;   // used by "maxCommute"
  commuteMinutes?: number; // used by "maxCommute"
}

export interface PersonRequirements {
  id: PersonId;
  maxRent: number | null;
  areas: string[];
  otherArea: string;
  items: RequirementItem[]; // holds ALL of that person's dealbreakers + preferences
}

export interface Listing {
  id: string;
  title: string;
  area: string;
  totalRent: number;
  deposit: number;
  floor: number;
  lift: boolean;
  parking: boolean;
  petFriendly: boolean;
  bathrooms: number;
  sourceLink: string;
  commuteTimes: Record<string, number>; // key = normalized (trim+lowercase) place name -> minutes
  verifiedBy: PersonId | null;
  createdAt: number; // keeps listing order stable, never re-sort by score
  photos: string[];  // compressed JPEG data URLs
}

export interface AppState {
  requirements: Record<PersonId, PersonRequirements>;
  listings: Listing[];
  selectedListingIds: string[]; // the 2–3 currently picked for "side by side"
}
