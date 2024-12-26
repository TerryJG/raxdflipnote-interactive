import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { captionStateAtom } from "@/lib/jotaiState";

type CaptionProps = {
  text: string;
  duration?: number;
}

const Caption = ({ text }: CaptionProps) => {
  const captionState = useAtomValue(captionStateAtom);
  const setCaption = useSetAtom(captionStateAtom);

  useEffect(() => {
    if (captionState?.duration) {
      const timer = setTimeout(() => {
        setCaption(null);
      }, captionState.duration * 1000);

      return () => clearTimeout(timer);
    }
  }, [captionState, setCaption]);

  if (!captionState) return null;

  const { transition = 0.5, animate = true } = captionState;

  // If animations are disabled, render without motion components
  if (!animate) {
    return (
      <div className="fixed bottom-10 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-md bg-zinc-700/80 backdrop-blur-sm px-4 py-2 text-center text-xl text-white">
        <p>"{text}"</p>
      </div>
    );
  }

  // With animations enabled, use motion components
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: transition }}
        className="fixed bottom-10 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-md bg-zinc-700 px-4 py-2 text-center text-xl text-white"
      >
        <p>"{text}"</p>
      </motion.div>
    </AnimatePresence>
  );
};

export default Caption;
