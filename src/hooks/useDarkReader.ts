"use client";
import { useEffect } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { hasDarkReader } from "@/lib/jotaiState";

export const useDarkReader = () => {
  const setHasDarkReader = useSetAtom(hasDarkReader);

  useEffect(() => {
    // Check if any Dark Reader related attributes exist
    const checkDarkReader = () => {
      const hasDarkReaderAttribute =
        document.documentElement.hasAttribute("data-darkreader-mode") ||
        document.documentElement.hasAttribute("data-darkreader-scheme") ||
        document.querySelector(".darkreader") !== null;

      setHasDarkReader(hasDarkReaderAttribute);
      console.log(hasDarkReaderAttribute ? "> Someone's using Dark Reader..." : "");
    };

    checkDarkReader(); // Initial check

    // Observe for Dark Reader changes. Still don't know how this works
    const observer = new MutationObserver(checkDarkReader);
    observer.observe(document.documentElement, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-darkreader-mode", "data-darkreader-scheme"],
      childList: true, // To detect .darkreader elements
    });

    return () => observer.disconnect();
  }, [setHasDarkReader]);

  return useAtomValue(hasDarkReader);
};
