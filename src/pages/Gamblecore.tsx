import { motion } from "motion/react";
import { useAtomValue } from "jotai";
import { gambleCount as gambleCountAtom, hasGambledBefore, hasFinishedIntro } from "@/lib/jotaiState";
import GambleLoop from "@/components/GambleLoop";
import { useState, useEffect } from "react";

export default function Gamblecore() {
  const count = useAtomValue(gambleCountAtom);
  const hasGambled = useAtomValue(hasGambledBefore);
  const hasWatchedIntro = useAtomValue(hasFinishedIntro);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  return (
    <motion.div 
      className="relative flex h-screen flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: hasWatchedIntro ? 1 : 0 }}
    >
      <GambleLoop />

      <div className="absolute left-1/2 top-10 flex -translate-x-1/2 items-center justify-center text-center text-xl">
        {isInitialized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {!hasGambled ? (
              <motion.div 
                key="tutorial"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                transition={{ duration: 0.5 }}
              >
                <motion.p className="md:hidden">
                  To gamble, tap the gambling machine, or click the shiny button below.
                </motion.p>
                <motion.p className="hidden leading-8 md:block">
                  To gamble, click the gambling machine, press <span className="rounded-sm bg-zinc-700 p-1 font-bold text-white">&nbsp;[Spacebar]&nbsp;</span> or click the shiny button below.
                </motion.p>
              </motion.div>
            ) : (
              <motion.p
                key="count"
                className="text-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.5,
                  ease: "easeOut",
                }}
              >
                Gamble count: <span className="font-bold">{count}</span>
              </motion.p>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
