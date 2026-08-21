import { Container } from "@/components/ui/Container";

export function FilterBar() {
  return <Container><div className="filter-bar"><button type="button">فیلترها <span>⌄</span></button><label>جستجو <input placeholder="نام محصول..." aria-label="جستجوی نمایشی" /></label><button type="button">مرتب‌سازی: جدیدترین <span>⌄</span></button></div></Container>;
}
