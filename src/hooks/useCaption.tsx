import { useState, useEffect } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { hasStartedGambling, captionStateAtom, currentVideoTimeAtom } from "@/lib/jotaiState";
import { AnimatePresence, motion } from "motion/react";

type CaptionProps = {
  text: string;
  start: number;
  end: number;
};

type VideoRef = {
  getCurrentTime: () => number;
  getDuration: () => number;
};

export const useCaptionPath = () => {
  const getPath = (filename: string) => {
    return `${import.meta.env.BASE_URL}videos/${filename}`; // Match the video path structure
  };

  return getPath;
};

export const useCaption = (playerRef: React.RefObject<VideoRef>, vttPath: string) => {
  const [captions, setCaptions] = useState<CaptionProps[]>([]);
  const [, setVideoDuration] = useState<number>(0);
  const setCaption = useSetAtom(captionStateAtom);
  const setCurrentTime = useSetAtom(currentVideoTimeAtom);

  // Handles parsing the time from the VTT file and converts it into different formats
  const parseTime = (timeStr: string): number => {
    const [time] = timeStr.trim().split(" ");

    // WebVTT format
    if (time.includes(".")) {
      const [hours, minutes, seconds] = time.split(":");
      return parseFloat(hours) * 3600 + parseFloat(minutes) * 60 + parseFloat(seconds);
    }
    // Traditional video editing formats like Premiere Pro (assuming that the video is in29.97fps)
    else {
      const [hours, minutes, seconds, frames] = time.split(":");
      const framesAsSeconds = parseInt(frames) / 29.97; // Convert frames to seconds
      return parseFloat(hours) * 3600 + parseFloat(minutes) * 60 + parseFloat(seconds) + framesAsSeconds;
    }
  };

  // Parses the VTT file and set captions
  useEffect(() => {
    const parseVTT = async () => {
      try {
        const response = await fetch(vttPath);

        if (!response.ok) {
          throw new Error(`Failed to load captions: ${vttPath} (${response.status})`);
        }

        const text = await response.text();
        const lines = text.split("\n").filter((line) => line.trim() !== "");
        const parsedCaptions: CaptionProps[] = [];

        for (let i = 1; i < lines.length; i++) {
          if (lines[i].includes("-->")) {
            const [start, end] = lines[i].split("-->").map(parseTime);

            const text = lines[i + 1].trim();
            parsedCaptions.push({ start, end, text });
            i++; // Skip the text line
          }
        }

        console.log("Parsed captions:", parsedCaptions);
        setCaptions(parsedCaptions);
      } catch (error) {
        console.error("Caption loading error:", error);
        setCaptions([]);
      }
    };

    parseVTT();
  }, [vttPath]);

  useEffect(() => {
    if (playerRef.current) {
      setVideoDuration(playerRef.current.getDuration());
    }
  }, [playerRef]);

  useEffect(() => {
    if (!playerRef.current || captions.length === 0) return;

    const checkTime = () => {
      const currentTime = playerRef.current?.getCurrentTime() || 0;
      setCurrentTime(currentTime); // Update the global video time from jotai

      const duration = playerRef.current?.getDuration() || 0;

      const activeCaption = captions.find((cap) => {
        const endTime = Math.min(cap.end, duration);
        return currentTime >= cap.start && currentTime < endTime;
      });

      const hasMultipleCaptions = captions.length > 1;

      if (activeCaption) {
        const isFirstCaption = captions.indexOf(activeCaption) === 0;
        const isLastCaption = captions.indexOf(activeCaption) === captions.length - 1;

        setCaption({
          text: activeCaption.text,
          animate: hasMultipleCaptions ? isFirstCaption || isLastCaption : true,
          onExit: isLastCaption,
          onFirst: isFirstCaption,
        });
      } else {
        setCaption({
          text: undefined,
          animate: false,
          onExit: false,
          onFirst: false,
        });
      }
    };

    const interval = setInterval(checkTime, 50);
    return () => clearInterval(interval);
  }, [captions, playerRef, setCaption, setCurrentTime]);
};

export default function CaptionOverlay({ text }: { text?: string }): JSX.Element | null {
  const hasInitiatedGambling = useAtomValue(hasStartedGambling);
  if (!hasInitiatedGambling) return null;

  // Debugging for current video time
  // const currentTime = useAtomValue(currentVideoTimeAtom);


  return (
    <AnimatePresence mode="wait">
      {text && (
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
          className="fixed bottom-10 left-0 right-0 z-[999] mx-auto w-fit cursor-default rounded-md bg-zinc-700/80 px-4 py-2 text-center text-xl text-white backdrop-blur-sm"
        >
          <div className={`flex flex-col items-center`}>
            {/* Debugging for current video time */}
            {/* <p className="text-sm text-gray-300">Time: {currentTime.toFixed(2)}s</p> */}
            <p>"{text}"</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
