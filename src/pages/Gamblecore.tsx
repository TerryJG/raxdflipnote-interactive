import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { gambleCount as gambleCountAtom, hasGambledBefore, hasFinishedIntro } from "@/lib/jotaiState";
import { motion } from "motion/react";
import GambleVideoLoop from "@/components/GambleVideoLoop";
import GambleCounter from "@/components/GambleCounter";
import GambleButton from "@/components/GambleButton";
import GamblecoreIntro from "@/components/intro/gamblecore.intro";
import MainLayout from "@/components/layouts/MainLayout";

export default function Gamblecore() {
  const count = useAtomValue(gambleCountAtom);
  const hasGambled = useAtomValue(hasGambledBefore);
  const hasWatchedIntro = useAtomValue(hasFinishedIntro);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  return (
    <>
      <MainLayout
        topSection={
          <motion.div className="w-full">
            <GambleCounter className="text-center" isInitialized={isInitialized} hasGambled={hasGambled} count={count} />
          </motion.div>
        }
        middleSection={
          <motion.div className="relative h-full w-full" initial={{ opacity: 0 }} animate={{ opacity: hasWatchedIntro ? 1 : 0 }} transition={{ duration: 0.5 }}>
            <GambleVideoLoop />
          </motion.div>
        }
        bottomSection={<GambleButton />}
      />

      {/* Intro Overlay */}
      {!hasWatchedIntro && (
        <div className="absolute inset-0 z-20 bg-white transition-opacity duration-500">
          <GamblecoreIntro />
        </div>
      )}
    </>
  );
}
