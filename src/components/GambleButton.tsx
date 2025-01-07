"use client";
import { useRef, useEffect } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { gambleCount, hasTriggeredGamblingSequence, triggerGambleSequence, hasDarkReader } from "@/lib/jotaiState";
import ResetCountButton from "@/components/ResetButton";

export default function GambleButton(): JSX.Element {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isSpacebarHeldRef = useRef(false);
  const currentGambleCount = useAtomValue(gambleCount);
  const isGambling = useAtomValue(hasTriggeredGamblingSequence);
  const setGambleCount = useSetAtom(gambleCount);
  const setIsGambling = useSetAtom(hasTriggeredGamblingSequence);
  const isDarkMode = useAtomValue(hasDarkReader);

  const handleGamble = () => {
    if (!isGambling) {
      triggerGambleSequence(setGambleCount, currentGambleCount, setIsGambling);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();

        if (!isSpacebarHeldRef.current && !isGambling) {
          const button = buttonRef.current;
          if (button) {
            button.focus();
            button.classList.add("scale-[0.97]");
            button.classList.remove("animate-bounce");
          }
          handleGamble();
        }
        isSpacebarHeldRef.current = true;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        isSpacebarHeldRef.current = false;
        const button = buttonRef.current;
        if (button) {
          button.classList.remove("scale-[0.97]");
          button.classList.add("animate-bounce");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleGamble, isGambling]);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        ref={buttonRef}
        disabled={isGambling}
        className={`animate-bounce rounded-md px-4 py-4 text-3xl font-bold text-white transition-all duration-500 hover:drop-shadow-md focus:outline-none focus:ring-0 active:scale-[0.97] active:animate-none ${
          isDarkMode ? "bg-blue-500" : "bg-gradient-to-r from-blue-500 to-purple-500"
        } ${isGambling ? "" : ""}`}
        onClick={handleGamble}
      >
        Gamble!
      </button>
      <ResetCountButton />
    </div>
  );
}
