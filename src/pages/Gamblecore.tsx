import { useState, useEffect } from "react";
import { useAtomValue, useAtom } from "jotai";
import { useDarkReader } from "@/hooks/useDarkReader";
import { gambleCount as gambleCountAtom, hasGambledBefore, hasFinishedIntro, hasReachedFirstGambleCountThreshold, hasRefreshedAfterThresholdBefore } from "@/lib/jotaiState";
import { motion } from "motion/react";
import { useAssetPath } from "@/hooks/usePath";
import GambleVideoLoop from "@/components/GambleVideoLoop";
import GambleCounter from "@/components/GambleCounter";
import GambleButton from "@/components/GambleButton";
import GamblecoreIntro from "@/components/intro/gamblecore.intro";
import MainLayout from "@/components/layouts/MainLayout";


// Refreshing logic
const RefreshPrompt = ({ onRefresh }: { onRefresh: () => void }) => {
  const getAssetPath = useAssetPath();
  const hasDarkReader = useDarkReader();
  
  return (
    <motion.div className="w-full cursor-pointer text-center transition-opacity hover:opacity-80 p-2 active:scale-95" onClick={onRefresh}>
      <img 
        title="It's time to REFRESH... the page."
        src={getAssetPath(hasDarkReader ? "refresh-white.svg" : "refresh-black.svg")} 
        alt="Refresh" 
        className="mx-auto h-16 w-16  motion-safe:animate-spin-slow" 
      />
    </motion.div>
  );
};

export default function Gamblecore() {
  const count = useAtomValue(gambleCountAtom);
  const hasGambled = useAtomValue(hasGambledBefore);
  const hasWatchedIntro = useAtomValue(hasFinishedIntro);
  const hasReachedFirstThreshold = useAtomValue(hasReachedFirstGambleCountThreshold);
  const [hasRefreshedAfterThreshold, setHasRefreshedAfterThreshold] = useAtom(hasRefreshedAfterThresholdBefore);
  const [isInitialized, setIsInitialized] = useState(false);
  const hasDarkReader = useDarkReader();

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const handleRefresh = () => {
    setHasRefreshedAfterThreshold(true);
    window.location.reload();
  };

  const renderContent = () => {
    if (hasReachedFirstThreshold && !hasRefreshedAfterThreshold) {
      return <RefreshPrompt onRefresh={handleRefresh} />;
    }

    return (
      <>
        <GambleCounter className="text-center" isInitialized={isInitialized} hasGambled={hasGambled} count={count} />
        <i className={`flex justify-center pt-2 text-center text-lg transition-opacity duration-500 ${hasDarkReader ? "opacity-80" : "opacity-0"}`}>
          (I don't blame you either if you're using&nbsp;<b>Dark Reader.</b>&nbsp;Starting at a white background is a bit jarring for extended periods of time.)
        </i>
      </>
    );
  };

  return (
    <>
      <MainLayout
        topSection={<motion.div className="w-full">{renderContent()}</motion.div>}
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
