"use client";
import { useUtilsContext } from "../context/utils-context";
import Header from "./components/header/header";
import Overlay from "./components/overlay";
import Sidebar from "./components/sidebar/sidebar";
import NewTeamPopup from "./teams/components/new-team-popup";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    createTeamPopup,
    createTeamPopupRef,
    createTeamPopupVisible,
    toggleCreateTeamPopup,
    setDisableTeamPopup,
  } = useUtilsContext();
  return (
    <>
      <main className="flex ">
        <Header />
        <Sidebar />

        <div className=" max-h-screen overflow-auto w-full pt-[57px] text-white max-md:pt-[47px]">
          {children}
        </div>
      </main>
      <NewTeamPopup
        newTeamPopup={createTeamPopup}
        newTeamPopupVisible={createTeamPopupVisible}
        newTeamPopupRef={createTeamPopupRef}
        toggleNewTeamPopup={toggleCreateTeamPopup}
        disableNewTeamPopup={setDisableTeamPopup}
      />
      <Overlay />
    </>
  );
}
