"use client";
import { useState, useEffect } from "react";
import { useAtomValue, useAtom } from "jotai";
import {
  gambleCount as gambleCountAtom,
  hasGambledBefore,
  hasFinishedIntro,
  hasReachedFirstGambleCountThreshold,
  hasRefreshedAfterThresholdBefore,
  hasDarkReader,
} from "@/lib/jotaiState";
import { useAssetPath } from "@/hooks/usePath";
import { motion } from "motion/react";
import GambleVideoLoop from "@/components/GambleVideoLoop";
import GambleCounter from "@/components/GambleCounter";
import GambleButton from "@/components/GambleButton";
import GamblecoreIntro from "@/components/intro/gamblecore.intro";
import MainLayout from "@/components/layouts/MainLayout";

const RefreshPrompt = ({ onRefresh }: { onRefresh: () => void }) => {
  const getAssetPath = useAssetPath();
  const hasDarkReaderEnabled = useAtomValue(hasDarkReader); // Recheck Dark Reader state

  return (
    <motion.div className="w-full cursor-pointer p-2 text-center transition-opacity hover:opacity-80 active:scale-95" onClick={onRefresh}>
      <img
        title="It's time to REFRESH... the page."
        src={getAssetPath(hasDarkReaderEnabled ? "refresh-white.svg" : "refresh-black.svg")}
        alt="Refresh"
        className="mx-auto h-16 w-16 motion-safe:animate-spin-slow"
      />
    </motion.div>
  );
};

export default function Gamblecore() {
  const hasDarkReaderEnabled = useAtomValue(hasDarkReader);
  const [isInitialized, setIsInitialized] = useState(false);
  const hasWatchedIntro = useAtomValue(hasFinishedIntro);
  const hasGambled = useAtomValue(hasGambledBefore);
  const count = useAtomValue(gambleCountAtom);
  const hasReachedFirstThreshold = useAtomValue(hasReachedFirstGambleCountThreshold);
  const [hasRefreshedAfterThreshold, setHasRefreshedAfterThreshold] = useAtom(hasRefreshedAfterThresholdBefore);

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
        {hasDarkReaderEnabled && (
          <div className="flex justify-center">
            <i className="inline-block px-2 pt-2 text-center text-lg">
              (I don't blame you either if you're using&nbsp;<b>Dark Reader.</b>&nbsp;Starting at a white background is a bit jarring for extended periods of time.)
            </i>
          </div>
        )}
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
