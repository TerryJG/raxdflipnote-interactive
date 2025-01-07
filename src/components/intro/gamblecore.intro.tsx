import { useState, useRef, useEffect } from "react";
import { useAtom } from "jotai";
import { hasFinishedIntro, hasReachedFirstGambleCountThreshold } from "@/lib/jotaiState";
import { useVideoPath } from "@/hooks/usePath";
import { useCaptionPath, useCaption } from "@/hooks/useCaption";
import ReactPlayer from "react-player/file";

export default function GamblecoreIntro() {
  const [hasWatchedIntro, setHasWatchedIntro] = useAtom(hasFinishedIntro);
  const [, setHasReachedThreshold] = useAtom(hasReachedFirstGambleCountThreshold);
  const hasLoggedCutscene = useRef(false);

  const getVideoPath = useVideoPath();
  const getCaptionPath = useCaptionPath();
  const playerRef = useRef<ReactPlayer>(null);

  const [, setCurrentTime] = useState(0);
  const [, setIsVideoReady] = useState(false);

  const getIntroFiles = () => {
    const storedCount = parseInt(localStorage.getItem("gambleCount") || "0"); 
    let videoFile = "gamblecore_intro.mp4";
    let captionFile = "gamblecore_intro.vtt";

    if (storedCount >= 700) {
      videoFile = "gamblecore_intro.mp4";
      captionFile = "gamblecore_intro.vtt";

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
      storedCount,
    };
  };

  const { videoPath, captionPath, storedCount } = getIntroFiles();

  // Additional logic for conditional storedCount events.
  // Also, this uses a ref to prevent re-renders.
  useEffect(() => {
    if (!hasLoggedCutscene.current && storedCount >= 200) {
      console.log("> Playing unskippable gamblecore cutscene...");
      setHasReachedThreshold(true);
      
      if (storedCount >= 700) {
        console.log("> Opening latest gamblecore cutscene in a new tab...");
        window.open("https://www.youtube.com/watch?v=qrxQZ2NKkVo", "_blank");
      }
      hasLoggedCutscene.current = true;
    }
  }, [storedCount, setHasReachedThreshold]);

  useCaption(
    playerRef as React.RefObject<{
      getCurrentTime: () => number;
      getDuration: () => number;
    }>,
    captionPath,
  );

  const handleVideoEnd = () => {
    if (hasWatchedIntro) return;
    if (playerRef.current) {
      const duration = playerRef.current.getDuration();
      setCurrentTime(duration);
    }
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
          playsinline
        />
      </div>
    </div>
  );
}
