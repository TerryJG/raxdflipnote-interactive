import { ReactNode } from "react";
import { useAtomValue } from "jotai";
import { captionStateAtom } from "@/lib/jotaiState";
import CaptionOverlay from "@/hooks/useCaption";
import { OnlineStatusUI } from "@/hooks/useOnlineStatus";

type MainLayoutProps = {
  topSection?: ReactNode;
  middleSection: ReactNode;
  bottomSection?: ReactNode;
};

export default function MainLayout({ 
  topSection, 
  middleSection, 
  bottomSection 
}: MainLayoutProps) {
  const captionState = useAtomValue(captionStateAtom);

  return (
    <div className="relative h-full w-full">
      <div className="relative h-full w-full">
        {/* Online Status Check */}
        <OnlineStatusUI />

        {/* Top Section */}
        {topSection && (
          <div className="absolute left-0 right-0 top-10 z-10 flex h-[60px] items-center justify-center">
            {topSection}
          </div>
        )}

        {/* Middle Section */}
        <div className="flex h-full w-full items-center justify-center">
          {middleSection}
          <CaptionOverlay text={captionState?.text} />
        </div>

        {/* Bottom Section */}
        {bottomSection && (
          <div className="absolute bottom-20 left-0 right-0 z-10 flex items-start justify-center">
            {bottomSection}
          </div>
        )}
      </div>
    </div>
  );
} 