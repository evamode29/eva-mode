"use client";

import type { Size } from "@/types";

type SizeSelectorProps = {
  sizes: Size[];
  selectedSizeId: string | null;
  onSelect: (sizeId: string) => void;
  availableSizeIds?: string[];
};

export function SizeSelector({
  sizes,
  selectedSizeId,
  onSelect,
  availableSizeIds,
}: SizeSelectorProps) {
  if (sizes.length === 0) {
    return null;
  }

  return (
    <div className="selector-group">
      <div className="selector-label">
        <strong>سایز</strong>

        <button type="button">
          راهنمای سایز
        </button>
      </div>

      <div className="option-row">
        {sizes.map((size) => {
          const isSelected =
            size.id === selectedSizeId;

          const isAvailable =
            availableSizeIds === undefined ||
            availableSizeIds.includes(size.id);

          return (
            <button
              key={size.id}
              type="button"
              className={[
                "size-option",
                isSelected
                  ? "is-selected"
                  : "",
                !isAvailable
                  ? "is-disabled"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-pressed={isSelected}
              disabled={!isAvailable}
              onClick={() => onSelect(size.id)}
            >
              {size.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}