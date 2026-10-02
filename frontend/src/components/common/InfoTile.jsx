function InfoTile({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
      <span className="text-[hsl(var(--primary))]">{icon}</span>
      <h3 className="mt-4 text-sm font-bold">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-[hsl(var(--muted-foreground))]">
        {text}
      </p>
    </div>
  );
}

export default InfoTile;
