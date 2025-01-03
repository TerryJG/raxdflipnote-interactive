import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { hasStartedGambling, captionStateAtom } from "@/lib/jotaiState";
import CaptionOverlay  from "@/hooks/useCaption";
import LandingPage from "@/pages/LandingPage";
import GamblecoreIntro from "@/pages/LoadingScreen";

export default function App() {
  const [hasInitiatedGambling] = useAtom(hasStartedGambling);
  const [captionState] = useAtom(captionStateAtom);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (hasInitiatedGambling) {
      const timer = setTimeout(() => {
        setShowIntro(true);
      }, 400); // Intentional delay to allow the video to load

      return () => clearTimeout(timer);
    } else {
      setShowIntro(false);
    }
  }, [hasInitiatedGambling]);

  useEffect(() => {
    console.log("LET'S GO GAMBLING!!!");
    console.log("An interactive gambling experience based on raxdflipnote's short, 'gamblecore' (https://youtu.be/IPFiKEm-oNI?si=4btLgRXz5lIfVqVX)'");
    console.log("Surely there's a message to be found here somewhere, right?");
  }, []);

  return (
    <main className="font-roboto flex h-[100dvh] w-[100dvw] flex-col justify-center gap-2 overflow-hidden md:h-screen md:w-screen">
      {hasInitiatedGambling && showIntro ? <GamblecoreIntro /> : <LandingPage />}
      <CaptionOverlay 
        text={captionState?.text} 
      />
    </main>
  );
}
