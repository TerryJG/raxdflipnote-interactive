import { useState, useEffect, useRef } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { gambleCount } from "@/lib/jotaiState";
import { useVideoPath } from "@/hooks/useVideoPath";
import { useCaptionPath, useCaption } from "@/hooks/useCaption";
import ReactPlayer from "react-player/lazy";
import ResetCountButton from "@/components/ResetButton";

export default function GambleLoop() {
  const [isReady, setIsReady] = useState({ loaded: false, playing: false });

  const getVideoPath = useVideoPath();
  const getCaptionPath = useCaptionPath();
  const baseVideoRef = useRef<ReactPlayer>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const isSpacebarHeldRef = useRef(false);
  const hasLogged = useRef(false);

  const [showOutcome, setIsOutcomeVisible] = useState(false);
  const [currentOutcome, setCurrentOutcome] = useState(1);
  const outcomeVideoRef = useRef<ReactPlayer>(null);

  const currentGambleCount = useAtomValue(gambleCount);
  const setGambleCount = useSetAtom(gambleCount);

  // Handles video loading
  useEffect(() => {
    if (!hasLogged.current) {
      console.log("> Gambling machine ready.");
      hasLogged.current = true;
    }
    setIsReady((prev) => ({ ...prev, loaded: true }));
  }, []);

  // Returns a random outcome number between 1 and 4. Used for outcome videos (gamblecore_outcome{number}.mp4)
  const getRandomOutcome = () => {
    return Math.floor(Math.random() * 4) + 1;
  };

  const triggerGamble = () => {
    if (isReady.loaded && !isReady.playing) {
      setCurrentOutcome(getRandomOutcome());
      console.log("> Gambling...");

      setIsReady((prev) => ({ ...prev, playing: true }));
      setIsOutcomeVisible(true); // is video visible?

      setGambleCount((prev) => prev + 1);
      console.log("> Gamble count:", currentGambleCount + 1);
    }
  };

  // useCaption hook to handle outcome video captions
  useCaption(
    outcomeVideoRef as React.RefObject<{
      getCurrentTime: () => number;
      getDuration: () => number;
    }>,
    getCaptionPath(`gamblecore_outcome.vtt`),
  );

  const handleVideoEnd = () => {
    // Only end when the video has actually finished
    if (outcomeVideoRef.current?.getCurrentTime() === outcomeVideoRef.current?.getDuration()) {
      console.log('"Aw, dang it..."');
      setIsOutcomeVisible(false);
      setIsReady((prev) => ({ ...prev, playing: false }));
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();

        // If the spacebar is not held down and the gamble video is not playing, trigger the gamble
        // This prevents auto-gambling by holding the spacebar
        if (!isSpacebarHeldRef.current && !isReady.playing) {
          const button = buttonRef.current;
          if (button) {
            button.focus();
            button.classList.add("scale-[0.97]");
            button.classList.remove("animate-bounce"); // remove animation if the spacebar or button is clicked/tapped/held
          }
          triggerGamble();
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
  }, [isReady.loaded, isReady.playing, setGambleCount]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      {/* Base loop video */}
      <div className="relative bg-red-300">
        <ReactPlayer ref={baseVideoRef} url={getVideoPath("gamblecore_loop.mp4")} width="100%" height="auto" playing={true} loop={true} muted={true} playsinline />

        {/* Outcome video overlay */}
        <div className={`absolute inset-0 ${showOutcome ? "opacity-100" : "opacity-0"}`}>
          <ReactPlayer
            ref={outcomeVideoRef}
            url={getVideoPath(`gamblecore_outcome${currentOutcome}.mp4`)}
            width="100%"
            height="auto"
            playing={showOutcome}
            onEnded={handleVideoEnd}
            muted={false}
            playsinline
            onProgress={({ playedSeconds }) => {
              // Optional: Log progress to debug video ending
              console.log('Video progress:', playedSeconds);
            }}
          />
        </div>

        {/* Clickable area overlay (for mobile) */}
        <div className="absolute inset-0 h-full w-full cursor-pointer" onClick={triggerGamble} onTouchStart={triggerGamble} />
      </div>

      <div className="mt-14 md:mb-10">
        <button
          ref={buttonRef}
          className="animate-bounce rounded-md bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-4 text-4xl font-bold text-white transition-all duration-500 hover:drop-shadow-md focus:outline-none focus:ring-0 focus:ring-purple-400 focus:ring-offset-2 active:scale-[0.97] active:animate-none"
          onClick={triggerGamble}
        >
          Gamble!
        </button>
        <ResetCountButton />
      </div>
    </div>
  );
}
