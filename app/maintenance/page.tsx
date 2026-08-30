import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "به‌زودی | EVA MODE",
  description: "EVA MODE به‌زودی با تجربه‌ای جدید در دسترس خواهد بود.",
};

export default function MaintenancePage() {
  return (
    <main className="maintenance-page">
      <div className="maintenance-card">
        <div className="maintenance-logo">
          EVA <span>MODE</span>
        </div>

        <div className="maintenance-line" />

        <p className="maintenance-eyebrow">
          COMING SOON
        </p>

        <h1>
          یک تجربه
          <br />
          جدید در راه است
        </h1>

        <p className="maintenance-description">
          فروشگاه EVA MODE در حال آماده‌سازی است.
          <br />
          به‌زودی با تجربه‌ای متفاوت و حرفه‌ای در کنار شما خواهیم بود.
        </p>

        <div className="maintenance-status">
          <span className="maintenance-dot" />
          در حال آماده‌سازی
        </div>

        <p className="maintenance-footer">
          EVA MODE
        </p>
      </div>
    </main>
  );
}