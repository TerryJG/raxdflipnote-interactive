import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils';

export const hasStartedGambling = atom(false);
export const hasFinishedIntro = atom(false);

export const isIdle = atom(false);
export const gambleCount = atomWithStorage('gambleCount', 0);

// Derive hasGambledBefore from gambleCount
export const hasGambledBefore = atom(
  (get) => get(gambleCount) >= 7
);

export const hasFinishedGambling = atom(false); // lol

export type CaptionState = {
  text: string;
  duration?: number;
  transition?: number;
  animate?: boolean;
} | null;  // no caption

export const captionStateAtom = atom<CaptionState>(null);
