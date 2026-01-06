import { Metadata } from "next";
import PanjikaBook from "@/components/PanjikaBook";

export const metadata: Metadata = {
    title: "Biraja Panjika - ବିରଜା ପଞ୍ଜିକା",
    description: "Browse the Biraja Panjika like a traditional printed book. View all 12 months with festivals, tithis, and agricultural dates.",
};

export default function BirajaPanjikaPage() {
    return <PanjikaBook panjikaType="biraja" />;
}
