import { useState, useRef, useEffect } from "react";
import { useVideoPath } from "@/hooks/useVideoPath";
import { useCaptionPath, useCaption } from "@/hooks/useCaption";
import ReactPlayer from "react-player/file";
import { motion } from "motion/react";
import { useAtomValue, useSetAtom } from "jotai";
import { gambleCount, hasTriggeredGamblingSequence, triggerGambleSequence } from "@/lib/jotaiState";

export default function GambleVideoLoop() {
  const [isReady, setIsReady] = useState({ loaded: false, playing: false });
  const [showOutcome, setIsOutcomeVisible] = useState(false);
  const [currentOutcome, setCurrentOutcome] = useState(1);

  const getVideoPath = useVideoPath();
  const getCaptionPath = useCaptionPath();
  const baseVideoRef = useRef<ReactPlayer>(null);
  const outcomeVideoRef = useRef<ReactPlayer>(null);
  const hasLogged = useRef(false);

  const isGambling = useAtomValue(hasTriggeredGamblingSequence);
  const setIsGambling = useSetAtom(hasTriggeredGamblingSequence);
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

  // Watch for gambling trigger
  useEffect(() => {
    if (isGambling && isReady.loaded && !isReady.playing) {
      setCurrentOutcome(getRandomOutcome());
      console.log("> Gambling...");
      setIsReady((prev) => ({ ...prev, playing: true }));
      setIsOutcomeVisible(true);
    }
  }, [isGambling, isReady.loaded, isReady.playing, currentGambleCount]);

  const getRandomOutcome = () => {
    return Math.floor(Math.random() * 2) + 1;
  };

  const handleVideoLoop = () => {
    if (isReady.loaded && !isReady.playing && !isGambling) {
      triggerGambleSequence(setGambleCount, currentGambleCount, setIsGambling);
    }
  };

  useCaption(
    outcomeVideoRef as React.RefObject<{
      getCurrentTime: () => number;
      getDuration: () => number;
    }>,
    getCaptionPath(`gamblecore_outcome.vtt`),
  );

  const handleVideoEnd = () => {
    if (outcomeVideoRef.current?.getCurrentTime() === outcomeVideoRef.current?.getDuration()) {
      console.log('"Aw, dang it..."');
      setIsOutcomeVisible(false);
      setIsReady((prev) => ({ ...prev, playing: false }));
      setIsGambling(false);
    }
  };

  return (
    <div className="relative -mt-10 flex h-full w-full items-center justify-center">
      <div className="relative">
        <ReactPlayer ref={baseVideoRef} url={getVideoPath("gamblecore_loop.mp4")} width="100%" height="auto" playing={true} loop={true} muted={true} playsinline />

        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 1 }}
          animate={{
            opacity: showOutcome ? 1 : 0,
            transition: { duration: 0 },
          }}
        >
          <ReactPlayer
            ref={outcomeVideoRef}
            url={getVideoPath(`gamblecore_outcome${currentOutcome}.mp4`)}
            width="100%"
            height="auto"
            playing={showOutcome}
            onEnded={handleVideoEnd}
            muted={false}
            playsinline
          />
        </motion.div>

        <div className="absolute inset-0 cursor-pointer" onClick={handleVideoLoop} onTouchStart={handleVideoLoop} />
      </div>
    </div>
  );
}
