import { useState, useRef } from "react";
import { useAtom } from "jotai";
import { hasFinishedIntro } from "@/lib/jotaiState";
import { useVideoPath } from "@/hooks/useVideoPath";
import { useCaptionPath, useCaption } from "@/hooks/useCaption";
import ReactPlayer from "react-player/file";

export default function GamblecoreIntro() {
  const [hasWatchedIntro, setHasWatchedIntro] = useAtom(hasFinishedIntro);

  const getVideoPath = useVideoPath();
  const getCaptionPath = useCaptionPath();
  const playerRef = useRef<ReactPlayer>(null);

  const [, setCurrentTime] = useState(0);
  const [, setIsVideoReady] = useState(false);


  const getIntroFiles = () => {
    // grab the gamble count from local storage set by jotai.
    // For some reason, grabbing it from the jotai state itself doesn't work.
    const storedCount = parseInt(localStorage.getItem("gambleCount") || "0"); 
    let videoFile = "gamblecore_intro.mp4"; // default
    let captionFile = "gamblecore_intro.vtt"; // default

    if (storedCount >= 700) {
      videoFile = "gamblecore_intro.mp4";
      captionFile = "gamblecore_intro.vtt";
      window.open("https://www.youtube.com/watch?v=qrxQZ2NKkVo", "_blank");

    } else if (storedCount >= 600) {
      videoFile = "gamblecore_intro6.mp4";
      captionFile = "gamblecore_intro6.vtt";

    } else if (storedCount >= 500) {
      videoFile = "gamblecore_intro5.mp4";
      captionFile = "gamblecore_intro5.vtt";

    } else if (storedCount >= 400) {
      videoFile = "gamblecore_intro4.mp4";
      captionFile = "gamblecore_intro4.vtt";

    } else if (storedCount >= 300) {
      videoFile = "gamblecore_intro3.mp4";
      captionFile = "gamblecore_intro3.vtt";

    } else if (storedCount >= 200) {
      videoFile = "gamblecore_intro2.mp4";
      captionFile = "gamblecore_intro2.vtt";
    }

    return {
      videoPath: getVideoPath(videoFile),
      captionPath: getCaptionPath(captionFile),
    };
  };

  const { videoPath, captionPath } = getIntroFiles();

  useCaption(
    playerRef as React.RefObject<{
      getCurrentTime: () => number;
      getDuration: () => number;
    }>,
    captionPath,
  );

  const handleVideoEnd = () => {
    if (hasWatchedIntro) return;
    setHasWatchedIntro(true);
  };

  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    setCurrentTime(playedSeconds);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="relative">
        <ReactPlayer
          ref={playerRef}
          url={videoPath}
          width="100%"
          height="auto"
          playing={true}
          muted={false}
          controls={false}
          onEnded={handleVideoEnd}
          onReady={() => setIsVideoReady(true)}
          onProgress={handleProgress}
        />
      </div>
    </div>
  );
}
