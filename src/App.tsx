import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { hasStartedGambling } from "@/lib/jotaiState";
import LandingPage from "@/pages/LandingPage";
import Gamblecore from "@/pages/Gamblecore";

function App() {
  const hasInitiatedGambling = useAtomValue(hasStartedGambling);

  useEffect(() => {
    console.log("LET'S GO GAMBLING!!!");
    console.log("An interactive gambling experience based on raxdflipnote's short, 'gamblecore' (https://youtu.be/IPFiKEm-oNI?si=4btLgRXz5lIfVqVX)'");
    console.log("Surely there's a message to be found here somewhere, right?");
  }, []);

  return (
    <main className="font-roboto flex h-[100dvh] w-[100dvw] flex-col justify-center gap-2 overflow-hidden md:h-screen md:w-screen">
      {hasInitiatedGambling ? <Gamblecore /> : <LandingPage />}
    </main>
  );
}

export default App;
