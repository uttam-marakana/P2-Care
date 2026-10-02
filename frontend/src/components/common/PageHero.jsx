function PageHero({ eyebrow, title, body, accent = false }) {
  return (
    <section
      className={`relative overflow-hidden ${accent ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "bg-[hsl(var(--muted)/.48)]"}`}
    >
      <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full border-[50px] border-[hsl(var(--secondary)/.2)]" />
      <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px] px-5 py-16 lg:px-8 lg:py-24">
        <p
          className={`mb-4 font-mono text-[10px] uppercase tracking-[.2em] ${accent ? "text-[hsl(var(--secondary))]" : "text-[hsl(var(--primary))]"}`}
        >
          {eyebrow}
        </p>
        <h1 className="max-w-3xl font-display text-6xl leading-[.9] tracking-[-.04em] sm:text-7xl">
          {title}
        </h1>
        <p
          className={`mt-6 max-w-xl text-base leading-7 ${accent ? "text-[hsl(var(--primary-foreground)/.72)]" : "text-[hsl(var(--muted-foreground))]"}`}
        >
          {body}
        </p>
      </div>
    </section>
  );
}

export default PageHero;
