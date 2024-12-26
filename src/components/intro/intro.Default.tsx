import { useAtom } from "jotai";
import { hasFinishedIntro, captionStateAtom } from "@/lib/jotaiState";
import { useState, useEffect } from "react";

export default function GamblecoreIntro_Default() {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasWatchedIntro, setHasWatchedIntro] = useAtom(hasFinishedIntro);
  const [, setCaptionState] = useAtom(captionStateAtom);

  useEffect(() => {
    if (isVideoReady) {
      setCaptionState({
        text: "Let's go gambling!",
        duration: 2,
      });
    }
  }, [isVideoReady, setCaptionState]);

  const handleVideoEnd = () => {
    if (hasWatchedIntro) return;
    setHasWatchedIntro(true);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <video autoPlay onLoadedData={() => setIsVideoReady(true)} onEnded={handleVideoEnd}>
        <source src="/src/assets/videos/gamblecore_intro.mp4" type="video/mp4" />
        Your browser is too old to gamble.
      </video>
    </div>
  );
}
