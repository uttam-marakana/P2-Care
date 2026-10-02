import { Link } from "react-router-dom";

function ButtonLink({ href, children, inverse = false, testId }) {
  return <Link to={href} data-testid={testId} className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${inverse ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] hover:-translate-y-0.5' : 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(20,87,91,.2)]'}`}>{children}</Link>;
}

export default ButtonLink;
