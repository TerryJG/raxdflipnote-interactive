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
import { motion, AnimatePresence } from "motion/react";
import GambleVideoLoop from "@/components/GambleVideoLoop";
import GambleCounter from "@/components/GambleCounter";
import GambleButton from "@/components/GambleButton";
import GamblecoreIntro from "@/components/intro/gamblecore.intro";
import MainLayout from "@/components/layouts/MainLayout";

const RefreshPrompt = ({ onRefresh }: { onRefresh: () => void }) => {
  const getAssetPath = useAssetPath();
  const hasDarkReaderEnabled = useAtomValue(hasDarkReader);

  return (
    <motion.div
      className="w-full cursor-pointer p-2 text-center transition-opacity hover:opacity-80 active:scale-95"
      onClick={onRefresh}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
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
    return (
      <AnimatePresence mode="wait">
        {hasReachedFirstThreshold && !hasRefreshedAfterThreshold ? (
          <RefreshPrompt key="refresh-prompt" onRefresh={handleRefresh} />
        ) : (
          <motion.div key="gamble-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <GambleCounter className="text-center" isInitialized={isInitialized} hasGambled={hasGambled} count={count} />
            {hasDarkReaderEnabled && hasGambled && (
              <div className="flex justify-center">
                <i className="inline-block px-2 pt-2 text-center text-lg">
                  (I don't blame you either if you're using&nbsp;<b>Dark Reader.</b>&nbsp;Starting at a white background is a bit jarring for extended periods of time.)
                </i>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
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
