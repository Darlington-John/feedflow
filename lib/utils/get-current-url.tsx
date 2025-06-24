import { useEffect, useState } from "react";

export const useCurrentUrl = () => {
  const [currentUrl, setCurrentUrl] = useState<string>("");

  useEffect(() => {
    // Ensure it's only run on client
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  return currentUrl;
};
