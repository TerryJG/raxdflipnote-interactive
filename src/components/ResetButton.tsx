"use client";
import { useState } from "react";
import { useAtom } from "jotai";
import { gambleCount, hasRefreshedAfterThresholdBefore } from "@/lib/jotaiState";

export default function ResetCountButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setGambleCount] = useAtom(gambleCount);
  const [, setHasRefreshedAfterThreshold] = useAtom(hasRefreshedAfterThresholdBefore);

  const handleResetCount = () => {
    setGambleCount(0);
    setHasRefreshedAfterThreshold(false);
    setIsModalOpen(false);
  };

  return (
    <section className="flex flex-col items-center justify-center text-center text-red-500 underline">
      <button className="transition-all duration-100 active:scale-[0.97]" onClick={() => setIsModalOpen(true)}>
        Reset Count
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-white p-4 shadow-lg">
            <p className="px-5">
              Are you sure you want to reset the count? <span className="font-bold text-red-500">99%</span> of gamblers quit before they hit big!
            </p>
            <div className="flex items-center justify-center gap-2 px-5 pt-3 text-center">
              <button className="rounded-md bg-red-500 p-2 text-white" onClick={handleResetCount}>
                Sure, let's run it back!
              </button>
              <button className="rounded-md bg-green-500 p-2 text-white" onClick={() => setIsModalOpen(false)}>
                No, I'm good!
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
