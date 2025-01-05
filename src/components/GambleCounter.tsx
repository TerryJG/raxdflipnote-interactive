import { motion, AnimatePresence } from "motion/react";

type GambleCounterProps = {
  className?: string;
  isInitialized: boolean;
  hasGambled: boolean;
  count: number;
};

export default function GambleCounter({ isInitialized, hasGambled, count, className }: GambleCounterProps): JSX.Element {
  return (
    <div className={`${className} text-xl`}>
      {isInitialized && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <AnimatePresence mode="wait">
            {!hasGambled ? (
              <motion.div key="tutorial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <motion.p className="md:hidden">To gamble, tap the gambling machine, or the shiny button below.</motion.p>
                <motion.p className="hidden leading-8 md:block">
                  To gamble, click the gambling machine, press <span className="rounded-sm bg-zinc-700 p-1 font-bold text-white">&nbsp;[Spacebar]&nbsp;</span> or click the shiny
                  button below.
                </motion.p>
              </motion.div>
            ) : (
              <motion.p
                key="count"
                className="text-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.2,
                  delay: 0.2,
                  ease: "easeOut",
                }}
              >
                Gamble count: <span className="font-bold">{count}</span>
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
