import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useVideoPath } from "@/hooks/useVideoPath";

// Hook to check online status
export function useOnlineStatusCheck() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      console.log("%c > Internet connection restored. Continue losin-- err... I mean, continue gambling!", "color: #22c55e")
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      console.log("%c > Someone has bad ping. Internet connection lost.", "color: #ef4444")
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return isOnline
}

// UI component to display online/offline status
export function OnlineStatusUI() {
  const isOnline = useOnlineStatusCheck()
  const getVideoPath = useVideoPath()

  return (
    <AnimatePresence>
      <motion.div
        className="fixed right-5 top-5 z-[999] max-w-[450px] p-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOnline ? 0 : 1 }}
        transition={{ duration: 0.01 }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-24 w-24"
        >
          <source src={getVideoPath("offline_icon.mp4")} type="video/mp4" />
        </video>
      </motion.div>
    </AnimatePresence>
  )
}