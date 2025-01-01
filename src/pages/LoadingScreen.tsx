import { useAtom } from "jotai";
import { hasFinishedIntro } from "@/lib/jotaiState";
import GamblecoreIntro_Default from "@/components/intro/gamblecore.intro";
import Gamblecore from "@/pages/Gamblecore";

export default function LoadingScreen() {
  const [hasWatchedIntro] = useAtom(hasFinishedIntro);

  return (
    <div className="relative h-full w-full">
      <Gamblecore />
      
      {!hasWatchedIntro && (
        <div 
          className="absolute inset-0 z-10 bg-white transition-opacity duration-500"
        >
          <GamblecoreIntro_Default />
        </div>
      )}
    </div>
  );
}

