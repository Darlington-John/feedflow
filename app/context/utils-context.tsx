"use client";
import React, { createContext, useContext, useMemo, useState } from "react";
import { usePopup } from "~/lib/utils/toggle-popups";

interface UtilsContextType {
  authPopup: boolean;
  authPopupVisible: boolean;
  authPopupRef: React.RefObject<HTMLDivElement | null>;
  toggleAuthPopup: () => void;
  setDisableToggle: React.Dispatch<React.SetStateAction<boolean>>;
  overlayOpen: boolean;
  setOverlayOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createTeamPopup: boolean;
  createTeamPopupVisible: boolean;
  createTeamPopupRef: React.RefObject<HTMLDivElement | null>;
  setDisableTeamPopup: React.Dispatch<React.SetStateAction<boolean>>;
  toggleCreateTeamPopup: () => void;
  rerenderKey: number;
  setRerenderKey: React.Dispatch<React.SetStateAction<number>>;
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
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [rerenderKey, setRerenderKey] = useState(0);
  const {
    isActive: createTeamPopup,
    isVisible: createTeamPopupVisible,
    ref: createTeamPopupRef,
    togglePopup: toggleCreateTeamPopup,
    setDisableToggle: setDisableTeamPopup,
  } = usePopup();

  const providerValue = useMemo(
    () => ({
      authPopup,
      authPopupRef,
      authPopupVisible,
      toggleAuthPopup,
      createTeamPopup,
      createTeamPopupRef,
      createTeamPopupVisible,
      toggleCreateTeamPopup,
      setDisableToggle,
      setDisableTeamPopup,
      overlayOpen,
      setOverlayOpen,
      setRerenderKey,
      rerenderKey,
    }),
    [
      authPopup,
      authPopupRef,
      authPopupVisible,
      toggleAuthPopup,
      createTeamPopup,
      createTeamPopupRef,
      createTeamPopupVisible,
      toggleCreateTeamPopup,
      setDisableToggle,
      setDisableTeamPopup,
      overlayOpen,
      setOverlayOpen,
      setRerenderKey,
      rerenderKey,
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
