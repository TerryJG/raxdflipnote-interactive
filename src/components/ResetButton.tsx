import { gambleCount } from "@/lib/jotaiState";
import { useAtom } from "jotai";
import { useState } from "react";

export default function ResetCountButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setGambleCount] = useAtom(gambleCount);

  const handleResetCount = () => {
    setGambleCount(0);
    setIsModalOpen(false);
  };

  return (
    <section className="flex flex-col items-center justify-center pt-5 text-center text-red-500 underline">
      <button className="transition-all duration-100 active:scale-[0.97]" onClick={() => setIsModalOpen(true)}>
        Reset Count
      </button>

      <dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <p className="px-5">
          Are you sure you want to reset the count? <span className="font-bold text-red-500">99%</span> of gamblers quit before they hit big!
        </p>
        <div className="flex items-center justify-center gap-2 px-5 text-center pt-3">
          <button className="rounded-md bg-red-500 p-2 text-white" onClick={() => handleResetCount()}>Sure, let's run it back!</button>
          <button className="rounded-md bg-green-500 p-2 text-white" onClick={() => setIsModalOpen(false)}>No, I'm good!</button>
        </div>
      </dialog>
    </section>
  );
}
