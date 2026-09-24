import type { ResolvedTheme } from "@/lib/preferences/theme-preference";
/** Scene equivalents of the CSS semantic palette. Colors encode roles, not quantities. */
export interface ScenePalette {
  background: number;
  fog: number;
  ground: number;
  ocean: number;
  nuclear: number;
  coolant: number;
  heat: number;
}
export const SCENE_PALETTES: Record<ResolvedTheme, ScenePalette> = {
  light: {
    background: 0xfaf8f3,
    fog: 0xf0ede5,
    ground: 0xd8d3c8,
    ocean: 0x9dbabd,
    nuclear: 0x65418f,
    coolant: 0x06646c,
    heat: 0x9c6418,
  },
  dark: {
    background: 0x15161d,
    fog: 0x15161d,
    ground: 0x292b35,
    ocean: 0x164658,
    nuclear: 0xc5adff,
    coolant: 0x72d4c6,
    heat: 0xf7c568,
  },
};
