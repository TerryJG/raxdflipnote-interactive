import { useAtom, useAtomValue } from "jotai";
import { hasFinishedIntro, captionStateAtom } from "@/lib/jotaiState";
import GamblecoreIntro from "@/components/intro/gamblecore.intro";
import CaptionOverlay from "@/hooks/useCaption";
import Gamblecore from "@/pages/Gamblecore";

export default function LoadingScreenIntro() {
  const [hasWatchedIntro] = useAtom(hasFinishedIntro);
  const captionState = useAtomValue(captionStateAtom);

  return (
    <div className="relative h-full w-full">
      <div className="relative h-full w-full">
        {/* Counter Section */}
        <div className="absolute left-0 right-0 top-0 z-10 flex h-[60px] items-center justify-center">{/* Counter will be shown in Gamblecore */}</div>

        {/* Video Section */}
        <div className="flex h-full w-full items-center justify-center">
          <Gamblecore />
          <CaptionOverlay text={captionState?.text} />
        </div>

        {/* Intro Overlay */}
        {!hasWatchedIntro && (
          <div className="absolute inset-0 z-20 bg-white transition-opacity duration-500">
            <GamblecoreIntro />
          </div>
        )}

        {/* Button Section */}
        <div className="absolute bottom-20 left-0 right-0 z-10 flex items-start justify-center">{/* Button will be shown in Gamblecore */}</div>
      </div>
    </div>
  );
}
