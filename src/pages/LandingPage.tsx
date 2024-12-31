import { useAtom } from "jotai";
import { hasStartedGambling } from "@/lib/jotaiState";

type LandingPageProps = {
  channelLink?: string | undefined;
};

export default function LandingPage({ channelLink = "https://www.youtube.com/@raxdflipnote" }: LandingPageProps) {
  const [hasInitiatedGambling, setHasInitiatedGambling] = useAtom(hasStartedGambling);

  const handleEntryClick = () => {
    if (hasInitiatedGambling) return;

    setTimeout(() => {
    console.log("%c Got another poor soul! Initiating gambling addiction...", "color: red;");
    setHasInitiatedGambling(true);
    }, 400);
  };
  return (
    <>
      <div className="flex items-center justify-center">
        <i className="bx bxl-youtube text-6xl text-red-500 md:text-8xl"></i>
        <a className="text-4xl text-zinc-600 underline md:text-5xl" href={channelLink} target="_blank">
          <p>/raxdflipnote</p>
        </a>
      </div>

      <div className="flex flex-col gap-5 items-center justify-center text-xl">
        <button className="rounded-md bg-blue-500 px-4 py-3 text-white transition-all duration-200 hover:drop-shadow-md active:scale-[0.97]" onClick={handleEntryClick}>
          <span className="md:hidden">Tap here to start gambling!</span>
          <span className="hidden md:block">Click here to start gambling!</span>
        </button>
        <em className="opacity-50">(Surely there's a message to be found here somewhere, right?)</em>
      </div>
    </>
  );
}
