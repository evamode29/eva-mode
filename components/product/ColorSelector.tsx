"use client";

import type { Color } from "@/types";

type ColorSelectorProps = {
  colors: Color[];
  selectedColorId: string | null;
  onSelect: (colorId: string) => void;
};

export function ColorSelector({
  colors,
  selectedColorId,
  onSelect,
}: ColorSelectorProps) {
  if (colors.length === 0) {
    return null;
  }

  const selectedColor = colors.find(
    (color) =>
      color.id === selectedColorId
  );

  return (
    <div className="selector-group">
      <div className="selector-label">
        <strong>رنگ</strong>

        <span>
          {selectedColor?.name ?? ""}
        </span>
      </div>

      <div className="color-row">
        {colors.map((color) => {
          const isSelected =
            color.id === selectedColorId;

          return (
            <button
              key={color.id}
              type="button"
              className={[
                "color-dot",
                isSelected
                  ? "is-selected"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                backgroundColor:
                  color.hex,
              }}
              aria-label={`انتخاب رنگ ${color.name}`}
              aria-pressed={isSelected}
              onClick={() =>
                onSelect(color.id)
              }
            />
          );
        })}
      </div>
    </div>
  );
}