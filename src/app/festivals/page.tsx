import { redirect } from "next/navigation";
import { festivalYears, todayIST } from "@/data/festival-dates";

export const revalidate = 86400;

// /festivals → this year's festival calendar (or the nearest year that has dates).
export default function FestivalsIndex() {
    const years = festivalYears();
    const now = +todayIST().slice(0, 4);
    redirect(`/festivals/${years.includes(now) ? now : years.find((y) => y > now) ?? years.at(-1)}`);
}
