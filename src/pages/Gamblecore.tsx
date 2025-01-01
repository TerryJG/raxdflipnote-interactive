import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { gambleCount as gambleCountAtom, hasGambledBefore, hasFinishedIntro } from "@/lib/jotaiState";
import GambleLoop from "@/components/GambleLoop";

export default function Gamblecore() {
  const count = useAtomValue(gambleCountAtom);
  const hasGambled = useAtomValue(hasGambledBefore);
  const hasWatchedIntro = useAtomValue(hasFinishedIntro);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showCount, setShowCount] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    const handleTransition = async () => {
      if (hasGambled) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setShowCount(true);
      } else {
        setShowCount(false);
      }
    };

    handleTransition();
  }, [hasGambled]);

  return (
    <div className={`relative flex h-screen flex-col items-center justify-center transition-opacity duration-500 ${hasWatchedIntro ? "opacity-100" : "opacity-0"}`}>
      <GambleLoop />

      <div className="absolute left-1/2 top-10 flex -translate-x-1/2 items-center justify-center text-center text-xl">
        {isInitialized && (
          <div className="relative opacity-100 transition-opacity duration-500">
            <div className={`transition-opacity duration-500 ${!hasGambled ? "visible opacity-100" : "invisible opacity-0"}`}>
              <p className="md:hidden">To gamble, tap the gambling machine, or click the shiny button below.</p>
              <p className="hidden leading-8 md:block">
                To gamble, click the gambling machine, press <span className="rounded-sm bg-zinc-700 p-1 font-bold text-white">&nbsp;[Spacebar]&nbsp;</span> or click the shiny
                button below.
              </p>
            </div>
            <p className={`absolute inset-0 text-2xl transition-opacity duration-500 ${showCount ? "visible opacity-100" : "invisible opacity-0"}`}>
              Gamble count: <span className="font-bold">{count}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
