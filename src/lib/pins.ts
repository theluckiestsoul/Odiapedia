import pins from "@/data/pins.json";

/** PIN code → [district, LGD village code][] from the Census 2011 Village Directory (reference year 2009). */
export const PINS = pins as unknown as Record<string, [string, string][]>;
export const PIN_CODES = Object.keys(PINS);
export const PIN_SOURCE = "PIN codes recorded for each village in the Census of India 2011 Village Directory (Odisha), reference year 2009";
