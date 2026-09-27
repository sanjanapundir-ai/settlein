import { Listing, PersonId, PersonRequirements } from "./types";
import { PEOPLE } from "./constants";
import { evaluateListingForPerson, formatRupees } from "./matching";

export function buildSummary(listings: Listing[], requirements: Record<PersonId, PersonRequirements>): string {
  if (listings.length === 0) return "SettleIn: no flats added yet.";
  const blocks = listings.map((listing) => {
    const lines = [`🏠 ${listing.title || "Untitled flat"} (${listing.area || "area not set"})`, `Total rent: ${formatRupees(listing.totalRent)}/month`];
    for (const person of PEOPLE) {
      const ev = evaluateListingForPerson(requirements[person.id], listing);
      lines.push(`• ${person.name}: share ${formatRupees(ev.rent.share)}${ev.rent.met === false ? " (over budget)" : ""}`);
      const missedDeal = ev.dealbreakers.filter((d) => d.met === false).map((d) => d.detail);
      const missedPref = ev.preferences.filter((p) => p.met === false).map((p) => p.detail);
      if (missedDeal.length) lines.push(`   ✗ Dealbreakers missed: ${missedDeal.join("; ")}`);
      if (missedPref.length) lines.push(`   ~ Preferences missed: ${missedPref.join("; ")}`);
    }
    return lines.join("\n");
  });
  return `SettleIn flat summary\n\n${blocks.join("\n\n")}`;
}
