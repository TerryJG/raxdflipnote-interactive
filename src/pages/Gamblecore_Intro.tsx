import { useAtom } from "jotai";
import { hasFinishedIntro } from "@/lib/jotaiState";
import GamblecoreIntro_Default from "@/components/intro/intro.Default";
import Gamblecore from "@/pages/Gamblecore";

export default function GamblecoreIntro() {
  const [hasWatchedIntro,] = useAtom(hasFinishedIntro);

  return (
    <>
      {hasWatchedIntro ? <Gamblecore /> : <GamblecoreIntro_Default />}
    </>
  );
}

