export default function DecorativeBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-24 -top-24 h-72 w-72 animate-float rounded-full bg-sky-200/50 blur-3xl" />
      <div className="absolute -right-20 top-1/3 h-80 w-80 animate-float rounded-full bg-rose-200/50 blur-3xl [animation-delay:-4s]" />
      <div className="absolute bottom-0 left-1/4 h-72 w-72 animate-float rounded-full bg-teal-200/40 blur-3xl [animation-delay:-8s]" />
      <div className="absolute right-1/4 top-10 h-40 w-40 rounded-full bg-butter/60 blur-3xl" />
    </div>
  );
}
