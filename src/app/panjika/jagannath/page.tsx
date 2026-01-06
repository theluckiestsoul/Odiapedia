import { Metadata } from "next";
import PanjikaBook from "@/components/PanjikaBook";

export const metadata: Metadata = {
    title: "Jagannath Panjika - ଜଗନ୍ନାଥ ପଞ୍ଜିକା",
    description: "Browse the Jagannath Panjika like a traditional printed book. View all 12 months with festivals, tithis, and auspicious dates.",
};

export default function JagannathPanjikaPage() {
    return <PanjikaBook panjikaType="jagannath" />;
}
