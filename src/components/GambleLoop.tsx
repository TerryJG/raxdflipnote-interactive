import { useEffect, useState, useRef } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { captionStateAtom, gambleCount } from "@/lib/jotaiState";
import ResetCountButton from "@/components/ResetButton";

export default function GambleLoop() {
  const [isReady, setIsReady] = useState({ loaded: false, playing: false });
  const [showOutcome, setIsOutcomeVisible] = useState(false);
  const [currentOutcome, setCurrentOutcome] = useState(1);
  const outcomeVideoRef = useRef<HTMLVideoElement>(null);
  const setCaption = useSetAtom(captionStateAtom);
  const setGambleCount = useSetAtom(gambleCount);
  const currentGambleCount = useAtomValue(gambleCount);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isSpacebarHeldRef = useRef(false);
  const hasLogged = useRef(false);

  const getRandomOutcome = () => {
    return Math.floor(Math.random() * 4) + 1; // returns 1, 2, 3, or 4
  };

  const triggerGamble = () => {
    if (isReady.loaded && !isReady.playing) {
      setCurrentOutcome(getRandomOutcome());
      console.log("> Gambling...");

      setCaption(null); // clears any existing caption
      setIsReady((prev) => ({ ...prev, playing: true }));
      setIsOutcomeVisible(true);

      setGambleCount((prev) => prev + 1);
      console.log("> Gamble count:", currentGambleCount + 1);
      playOutcome();
    }
  };

  // Handles video loading
  useEffect(() => {
    const video = outcomeVideoRef.current;
    if (!video) return;

    video.load();
    if (!hasLogged.current) {
      console.log("> Gambling machine ready.");
      hasLogged.current = true;
    }
    video.addEventListener("loadeddata", () => {
      setIsReady((prev) => ({ ...prev, loaded: true }));
    });
  }, []);

  const playOutcome = async () => {
    const video = outcomeVideoRef.current;
    if (!video) return;

    try {
      video.currentTime = 0;
      await video.play();
      console.log("> Calculating outcome...");

      setTimeout(() => {
        setCaption({
          text: "Aw, dang it...",
          duration: 0.95, // intentional delay to match video
          transition: 0,
          animate: false,
        });
      }, 700);
    } catch (error) {
      console.error("Error calculating outcome:", error);
      setIsReady((prev) => ({ ...prev, playing: false }));
      setIsOutcomeVisible(false);
    }
  };

  // Handles spacebar press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();

        // activates only if spacebar isn't held and the video overlay isn't playing
        if (!isSpacebarHeldRef.current && !isReady.playing) {
          const button = buttonRef.current;
          if (button) {
            button.focus();
            button.classList.add("scale-[0.97]");
            button.classList.remove("animate-bounce");
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
  }, [isReady.loaded, isReady.playing, setCaption]);

  const handleVideoEnd = () => {
    console.log('"Aw, dang it..."');
    if (outcomeVideoRef.current) {
      outcomeVideoRef.current.currentTime = 0;
    }
    setIsOutcomeVisible(false);
    setIsReady((prev) => ({ ...prev, playing: false }));
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      {/* Base loop video */}
      <div className="relative">
        <video autoPlay loop muted className="pointer-events-none">
          <source src="/videos/gamblecore_loop.mp4" type="video/mp4" />
          Your browser is too old to gamble.
        </video>

        {/* Outcome video overlay */}
        <div className={`absolute inset-0 ${showOutcome ? "opacity-100" : "opacity-0"}`}>
          <video
            ref={outcomeVideoRef}
            onEnded={handleVideoEnd}
            preload="auto"
            className="pointer-events-none"
            onLoadedData={() => console.log("> Pre-determined outcome already calculated.")}
          >
            <source src={`/videos/gamblecore_outcome${currentOutcome}.mp4`} type="video/mp4" />
            Your browser is too old to gamble.
          </video>
        </div>

        {/* Clickable area overlay (for mobile) */}
        <div className="absolute inset-0 h-full w-full cursor-pointer" onClick={triggerGamble} onTouchStart={triggerGamble}></div>
      </div>

      <div className="mt-14 md:mb-10">
        <button
          ref={buttonRef}
          className="animate-bounce rounded-md bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-4 text-4xl font-bold text-white transition-all duration-500 hover:drop-shadow-md focus:outline-none focus:ring-0 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 active:scale-[0.97] active:animate-none"
          onClick={triggerGamble}
        >
          Gamble!
        </button>
        <ResetCountButton />
      </div>
    </div>
  );
}
