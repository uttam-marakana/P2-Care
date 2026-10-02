function SectionIntro({ eyebrow, title, children, action }) {
  return (
    <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">
          <span className="h-px w-7 bg-[hsl(var(--accent))]" />
          {eyebrow}
        </p>
        <h2 className="max-w-xl font-display text-4xl leading-[.98] tracking-[-.025em] text-[hsl(var(--foreground))] md:text-5xl">
          {title}
        </h2>
        {children && (
          <div className="mt-4 max-w-xl text-[15px] leading-7 text-[hsl(var(--muted-foreground))]">
            {children}
          </div>
        )}
      </div>
      {action}
    </div>
  );
}

export default SectionIntro;
