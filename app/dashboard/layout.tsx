"use client";
import { useUtilsContext } from "../context/utils-context";
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
        <Sidebar />

        <div className=" max-h-screen overflow-auto w-full pt-[57px] text-white max-md:pt-[47px] relative ">
          <div
            style={{
              backgroundImage: `url(/images/doodle.svg)`,
            }}
            className="pointer-events-none   fixed  top-0 left-0 w-full min-h-screen   h-full object-cover opacity-20 z-1"
          ></div>
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
