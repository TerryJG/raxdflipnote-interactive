"use client";
import { useAtom } from "jotai";
import { hasStartedGambling } from "@/lib/jotaiState";

type LandingPageProps = {
  channelLink?: string | undefined;
};

export default function LandingPage({ channelLink = "https://www.youtube.com/@raxdflipnote" }: LandingPageProps) {
  const [, setHasInitiatedGambling] = useAtom(hasStartedGambling);

  const handleEntryClick = () => {
    console.log("%c Got another poor soul! Initiating gambling addiction...", "color: red;");
    setHasInitiatedGambling(true);
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <i className="bx bxl-youtube text-6xl text-red-500 md:text-8xl"></i>
        <a className="text-4xl text-zinc-600 underline md:text-5xl" href={channelLink} target="_blank">
          <p>/raxdflipnote</p>
        </a>
      </div>

      <div className="flex flex-col items-center justify-center gap-5 text-center text-xl">
        <button 
          className="rounded-md bg-blue-500 px-4 py-3 text-white transition-all duration-200 hover:drop-shadow-md active:scale-[0.97]" 
          onClick={handleEntryClick}
        >
          <span className="md:hidden">Tap here to start gambling!</span>
          <span className="hidden md:block">Click here to start gambling!</span>
        </button>
        <em className="opacity-50">(Surely there's a message to be found here somewhere, right?)</em>

        <a 
          className="transition-all duration-200 hover:scale-110 active:scale-95 absolute bottom-10 left-1/2 -translate-x-1/2 z-50" 
          href="https://github.com/TerryJG/raxdflipnote-interactive" 
          target="_blank"
        >
          <i className="bx bxl-github text-4xl opacity-50 w-full h-full"></i>
        </a>
      </div>
    </>
  );
}
