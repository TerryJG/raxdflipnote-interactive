import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { gambleCount as gambleCountAtom, hasGambledBefore, hasFinishedIntro, captionStateAtom } from "@/lib/jotaiState";
import { motion } from "motion/react";
import GambleVideoLoop from "@/components/GambleVideoLoop";
import GambleCounter from "@/components/GambleCounter";
import GambleButton from "@/components/GambleButton";
import CaptionOverlay from "@/hooks/useCaption";

export default function Gamblecore() {
  const count = useAtomValue(gambleCountAtom);
  const hasGambled = useAtomValue(hasGambledBefore);
  const hasWatchedIntro = useAtomValue(hasFinishedIntro);
  const [isInitialized, setIsInitialized] = useState(false);
  const captionState = useAtomValue(captionStateAtom);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  return (
    <div className="relative h-full w-full">
      <motion.div className="relative h-full w-full" initial={{ opacity: 0 }} animate={{ opacity: hasWatchedIntro ? 1 : 0 }} transition={{ duration: 0.5 }}>
        {/* Counter */}
        <motion.div className="absolute left-0 right-0 top-0 z-10 flex h-[60px] items-center justify-center">
          <GambleCounter className="text-center" isInitialized={isInitialized} hasGambled={hasGambled} count={count} />
        </motion.div>

        {/* Video Loop && Caption overlay */}
        <div className="flex h-full w-full items-center justify-center">
          <GambleVideoLoop />
          <CaptionOverlay text={captionState?.text} />
        </div>

        {/* Button Section */}
        <motion.div className="absolute bottom-20 left-0 right-0 z-10 flex items-start justify-center">
          <GambleButton />
        </motion.div>
      </motion.div>
    </div>
  );
}
