function Field({ label, id, children }) {
  return (
    <label
      htmlFor={id}
      className="mb-5 block text-xs font-bold text-[hsl(var(--foreground))]"
    >
      {label}
      {children}
    </label>
  );
}

export default Field;
