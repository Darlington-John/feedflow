"use client";
import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  duration?: number;
}
export const usePopup = ({ duration = 280 }: Props = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [disableToggle, setDisableToggle] = useState(false);

  const togglePopup = useCallback(() => {
    if (disableToggle) return;
    if (!isActive) {
      setIsActive(true);
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setTimeout(() => setIsActive(false), duration);
    }
  }, [isActive, disableToggle, duration]);
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (disableToggle) return;
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsVisible(false);
        setTimeout(() => setIsActive(false), duration);
      }
    },
    [disableToggle, duration]
  );
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return {
    isVisible,
    isActive,
    ref,
    disableToggle, // 👈 expose state
    setDisableToggle,
    togglePopup,
    setIsVisible,
    setIsActive,
  };
};
