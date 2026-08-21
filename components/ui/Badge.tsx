import type { ReactNode } from "react";

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "sale" }) {
  return <span className={`eva-badge eva-badge--${tone}`}>{children}</span>;
}
