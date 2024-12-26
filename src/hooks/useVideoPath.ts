const useVideoPath = () => {
  const getPath = (filename: string) => {
    const base = import.meta.env.VITE_BASE_URL || '';
    return `${base}/videos/${filename}`;
  };

  return getPath;
};

export default useVideoPath; 