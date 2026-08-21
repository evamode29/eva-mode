import type { Size } from "@/types";

export function SizeSelector({ sizes }: { sizes: Size[] }) {
  return <div className="selector-group"><div className="selector-label"><strong>سایز</strong><button type="button">راهنمای سایز</button></div><div className="option-row">{sizes.map((size) => <button type="button" key={size.id}>{size.name}</button>)}</div></div>;
}
