/** Region colours shared by the /map page (server) and the interactive map (client). */
export const REGION_STYLE: Record<"coastal" | "central" | "northern" | "southern" | "western", { label: string; fill: string }> = {
    coastal: { label: "Coastal", fill: "#2a9d8f" },
    central: { label: "Central", fill: "#e9b44c" },
    northern: { label: "Northern & western", fill: "#7389bf" },
    southern: { label: "Southern", fill: "#d9774f" },
    western: { label: "Western", fill: "#a98a5c" },
};
