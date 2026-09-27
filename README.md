# SettleIn

A no-backend flat-hunting comparison app for three friends (Riya, Meera & Kavita) sharing a flat. It lays out the facts and tradeoffs for each person and never ranks, scores or recommends a flat — the humans decide.

**Live:** https://settlein-nine.vercel.app

- Per-person requirements: rent budget, areas, dealbreakers and preferences (lift, parking, pets, bathrooms, commute limits)
- Listings with photos (compressed client-side), grouped into "Meets everyone's dealbreakers" and "Misses at least one dealbreaker", with plain-English reasons
- Side-by-side compare for 2–3 flats, and a copy-to-clipboard summary
- All data lives in the browser's localStorage — no server, no API keys

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v3 and lucide-react.

```bash
npm install
npm run dev
```
