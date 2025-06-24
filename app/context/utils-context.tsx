"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePopup } from "~/lib/utils/toggle-popups";

interface UtilsContextType {
  authPopup: boolean;
  authPopupVisible: boolean;
  authPopupRef: React.RefObject<HTMLDivElement | null>;
  toggleAuthPopup: () => void;
  setDisableToggle: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkmode: boolean;
  setIsDarkmode: React.Dispatch<React.SetStateAction<boolean>>;
  toggleDarkmode: () => void;
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  createCommunityPopup: boolean;
  createCommunityPopupVisible: boolean;
  createCommunityPopupRef: React.RefObject<HTMLDivElement | null>;
  setDisableCommunityPopup: React.Dispatch<React.SetStateAction<boolean>>;
  toggleCreateCommunityPopup: () => void;
}
export const UtilsContext = createContext<UtilsContextType | null>(null);

export const UtilsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    isActive: authPopup,
    isVisible: authPopupVisible,
    ref: authPopupRef,
    togglePopup: toggleAuthPopup,
    setDisableToggle: setDisableToggle,
  } = usePopup();
  const {
    isActive: createCommunityPopup,
    isVisible: createCommunityPopupVisible,
    ref: createCommunityPopupRef,
    togglePopup: toggleCreateCommunityPopup,
    setDisableToggle: setDisableCommunityPopup,
  } = usePopup();
  const [isDarkmode, setIsDarkmode] = useState(true);
  const [checked, setChecked] = useState(true);
  useEffect(() => {
    const storedPreference = localStorage.getItem("darkMode");

    // Default to dark if nothing is stored
    const darkModePreference =
      storedPreference === null ? true : storedPreference === "true";

    setIsDarkmode(darkModePreference);
    setChecked(darkModePreference);

    const root = document.documentElement;
    root.setAttribute("data-theme", darkModePreference ? "dark" : "light");
  }, []);

  const toggleDarkmode = useCallback(() => {
    const newMode = !isDarkmode;
    document.documentElement.setAttribute(
      "data-theme",
      newMode ? "dark" : "light"
    );
    localStorage.setItem("darkMode", String(newMode));
    setIsDarkmode(newMode);
    setChecked(newMode);
  }, [isDarkmode]);

  const providerValue = useMemo(
    () => ({
      authPopup,
      authPopupRef,
      authPopupVisible,
      toggleAuthPopup,
      toggleDarkmode,
      isDarkmode,
      setIsDarkmode,
      checked,
      setChecked,
      createCommunityPopup,
      createCommunityPopupRef,
      createCommunityPopupVisible,
      toggleCreateCommunityPopup,
      setDisableToggle,
      setDisableCommunityPopup,
    }),
    [
      authPopup,
      authPopupRef,
      authPopupVisible,
      toggleAuthPopup,
      toggleDarkmode,
      isDarkmode,
      setIsDarkmode,
      checked,
      setChecked,
      createCommunityPopup,
      createCommunityPopupRef,
      createCommunityPopupVisible,
      toggleCreateCommunityPopup,
      setDisableToggle,
      setDisableCommunityPopup,
    ]
  );

  return (
    <UtilsContext.Provider value={providerValue}>
      {children}
    </UtilsContext.Provider>
  );
};

export const useUtilsContext = (): UtilsContextType => {
  const context = useContext(UtilsContext);
  if (!context) {
    throw new Error("Context must be used within a Provider");
  }
  return context;
};
