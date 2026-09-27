import { PEOPLE } from "@/lib/constants";
import Avatar from "./Avatar";

export default function Header() {
  return (
    <header className="flex flex-col items-center pb-2 pt-8 text-center sm:pt-12">
      <div className="mb-4 flex -space-x-3">
        {PEOPLE.map((p) => (
          <Avatar key={p.id} person={p} size={56} className="shadow-fluffy" />
        ))}
      </div>
      <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
        Settle<span className="text-violet-500">In</span>
      </h1>
      <p className="mt-2 max-w-md text-base text-ink/70">
        Flat hunting for {PEOPLE.map((p) => p.name).join(", ").replace(/, ([^,]*)$/, " & $1")}. Just the facts, per person. You decide.
      </p>
    </header>
  );
}
