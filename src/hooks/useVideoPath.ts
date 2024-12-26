const useVideoPath = () => {
  const getPath = (filename: string) => {
    return `${import.meta.env.BASE_URL}videos/${filename}`;
  };

  return getPath;
};

export default useVideoPath; 