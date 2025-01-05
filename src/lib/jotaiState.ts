import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils';

// When the user has clicked the Landing Page button
export const hasStartedGambling = atom(false);

// When the user has watched the intro video
export const hasFinishedIntro = atom(false);

// When the user is idle 
// export const isIdle = atom(false);

// The number of times the user has gambled
export const gambleCount = atomWithStorage('gambleCount', 0);

// Derive value from gambleCount. This is to track if the user has gambled before. Mainly used for tutorial sequence.
export const hasGambledBefore = atom(
  (get) => get(gambleCount) >= 7
);

// When the user has triggered the gambling sequence
export const hasTriggeredGamblingSequence = atom(false);
export const triggerGambleSequence = ( // Function to handle gambling trigger
  setGambleCount: (update: (prev: number) => number) => void,
  currentCount: number,
  setIsGambling: (value: boolean) => void
) => {
  setGambleCount((prev) => prev + 1);
  console.log("> Gamble count:", currentCount + 1);
  setIsGambling(true);
};


// Retrieve the current time of the video from ReactPlayer
export const currentVideoTimeAtom = atom<number>(0);

// Caption type definition and state
export type CaptionState = {
  text: string | undefined;
  animate?: boolean;
  onEnter?: boolean;
  onExit?: boolean;
  onFirst?: boolean;
  onLast?: boolean;
};

export const captionStateAtom = atom<CaptionState>({
  text: undefined,
  animate: false,
  onEnter: false,
  onExit: false,
  onFirst: false,
  onLast: false
});




// You would miss the entire message of this funny side-project if this state is ever used.
export const hasFinishedGambling = atom(false); // lol

