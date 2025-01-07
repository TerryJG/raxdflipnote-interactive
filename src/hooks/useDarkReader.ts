import { useState, useEffect } from 'react';

export const useDarkReader = () => {
  const [hasDarkReader, setHasDarkReader] = useState(false);

  useEffect(() => {
    // Check if any element has a data-darkreader attribute
    const checkDarkReader = () => {
      const hasDarkReaderAttribute = document.querySelector('[data-darkreader-scheme]') !== null;
      setHasDarkReader(hasDarkReaderAttribute);
    };
    
    checkDarkReader(); // Initial check

    // Still unsure how this works, even with multiple articles.
    const observer = new MutationObserver(checkDarkReader);
    observer.observe(document.documentElement, {
      attributes: true,
      subtree: true,
      attributeFilter: ['data-darkreader-scheme']
    });

    return () => observer.disconnect();
  }, []);

  return hasDarkReader;
}; 