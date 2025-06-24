"use client";
import Header from "./components/header/header";
import Sidebar from "./components/sidebar/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex ">
      <Header />
      <Sidebar />
      <div className=" max-h-screen overflow-auto w-full pt-[55px] text-white">
        {children}
      </div>
    </main>
  );
}
