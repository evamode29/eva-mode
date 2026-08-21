import type { Color } from "@/types";

export function ColorSelector({ colors }: { colors: Color[] }) {
  return <div className="selector-group"><div className="selector-label"><strong>رنگ</strong><span>{colors[0]?.name}</span></div><div className="color-row">{colors.map((color) => <button type="button" key={color.id} className="color-dot" style={{ backgroundColor: color.hex }} aria-label={color.name} />)}</div></div>;
}
