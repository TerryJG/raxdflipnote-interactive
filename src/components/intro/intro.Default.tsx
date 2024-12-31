import { useAtom } from "jotai";
import { hasFinishedIntro, captionStateAtom } from "@/lib/jotaiState";
import { useState, useEffect } from "react";
import useVideoPath from "@/hooks/useVideoPath";

export default function GamblecoreIntro_Default() {
  const getVideoPath = useVideoPath();
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasWatchedIntro, setHasWatchedIntro] = useAtom(hasFinishedIntro);
  const [, setCaptionState] = useAtom(captionStateAtom);

  useEffect(() => {
    if (isVideoReady) {
      setCaptionState({
        text: "Let's go gambling!",
        duration: 1.75,
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
        <source src={getVideoPath('gamblecore_intro.mp4')} type="video/mp4" />
        Your browser is too old to gamble.
      </video>
    </div>
  );
}
