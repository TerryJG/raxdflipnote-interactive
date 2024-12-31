import { useAtom } from "jotai";
import { hasFinishedIntro } from "@/lib/jotaiState";
import GamblecoreIntro_Default from "@/components/intro/intro.Default";
import Gamblecore from "@/pages/Gamblecore";
import { motion, AnimatePresence } from "motion/react";

export default function GamblecoreIntro() {
  const [hasWatchedIntro] = useAtom(hasFinishedIntro);

  return (
    <div className="relative h-full w-full">
      <Gamblecore />
      
      <AnimatePresence>
        {!hasWatchedIntro && (
          <motion.div 
            className="absolute inset-0 z-10 bg-white"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GamblecoreIntro_Default />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

