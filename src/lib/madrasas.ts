import { Madrasa } from "@/types/database";

export interface StaticMadrasa {
  id: string;
  name: string;
  city?: string | null;
  contact_person?: string | null;
  active: boolean;
  posts?: { id: string }[];
}

export const KNOWN_MADRASAS: StaticMadrasa[] = [
  {
    id: "11111111-1111-4111-a111-111111111111",
    name: "Darul Uloom Alamgir Ahmednagar",
    city: "Ahmednagar",
    contact_person: "Head In-Charge (Ahmednagar)",
    active: true,
  },
  {
    id: "4bff8203-5119-4e4c-97eb-a2d48843b141",
    name: "Nizamiya Talimul Quran",
    city: "Nagpur",
    contact_person: "Head In-Charge (Nagpur)",
    active: true,
  },
  {
    id: "e1111111-1111-4111-a111-111111111111",
    name: "Madarsa Ansar",
    city: "Nagpur",
    contact_person: null,
    active: true,
  },
  {
    id: "e2222222-2222-4222-a222-222222222222",
    name: "Madarsa Baqiyatus-Saliha (girls)",
    city: "Nagpur",
    contact_person: null,
    active: true,
  },
];

/**
 * Merges database madrasas with default known madrasas.
 * Ensures all 4 madrasas (Alamgir, Nizamiya, Ansar, Baqiyatus-Saliha) are present.
 */
export function mergeWithKnownMadrasas<T extends { id?: string; name?: string; city?: string | null }>(
  dbMadrasas: T[] | null | undefined
): T[] {
  const result: T[] = [...(dbMadrasas || [])];

  for (const known of KNOWN_MADRASAS) {
    const existingIndex = result.findIndex((m) => {
      if (m.id && m.id === known.id) return true;
      if (m.name) {
        const mLower = m.name.toLowerCase();
        const kLower = known.name.toLowerCase();
        // Match key identifying tokens
        if (kLower.includes("alamgir") && mLower.includes("alamgir")) return true;
        if (kLower.includes("nizamiya") && mLower.includes("nizamiya")) return true;
        if (kLower.includes("ansar") && mLower.includes("ansar")) return true;
        if (kLower.includes("baqiyatus") && mLower.includes("baqiyatus")) return true;
      }
      return false;
    });

    if (existingIndex === -1) {
      result.push(known as unknown as T);
    }
  }

  return result;
}

