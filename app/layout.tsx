"use client";
import "./globals.css";
import localFont from "next/font/local";
import { UtilsProvider } from "./context/utils-context";
import { AuthProvider } from "./context/auth-context";

import { Provider } from "react-redux";
import AuthPrompt from "./auth/auth";
import { ToastContainer } from "react-toastify";

import NProgress from "nprogress";
import { store } from "~/lib/redux/store";
import { NextAuthProvider } from "./next-auth-provider";
import Header from "./dashboard/components/header/header";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Router } from "next/router";

const SFReg = localFont({
  src: "./fonts/SF-Pro-Display-Regular.otf",
  variable: "--font-sf-reg",
});

const SFBlack = localFont({
  src: "./fonts/SF-Pro-Display-Black.otf",
  variable: "--font-sf-black",
});

const SFBold = localFont({
  src: "./fonts/SF-Pro-Display-Bold.otf",
  variable: "--font-sf-bold",
});

const SFLight = localFont({
  src: "./fonts/SF-Pro-Display-Light.otf",
  variable: "--font-sf-light",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done();
    }, 500); // artificial delay (optional)

    return () => clearTimeout(timer);
  }, [pathname]);

  Router.events.on("routeChangeStart", () => NProgress.start());
  Router.events.on("routeChangeComplete", () => NProgress.done());
  Router.events.on("routeChangeError", () => NProgress.done());
  return (
    <html lang="en">
      <head>
        <title>feedflow</title>

        <meta name="description" content="App by Dax" />
      </head>
      <body
        className={`${SFReg.variable}   ${SFBlack.variable}  ${SFBold.variable}  ${SFLight.variable}  antialiased  bg-navy`}
      >
        <NextAuthProvider>
          <Provider store={store}>
            <AuthProvider>
              <UtilsProvider>
                <ToastContainer position="bottom-right" closeButton={false} />
                <AuthPrompt />
                <Header />

                {children}
              </UtilsProvider>
            </AuthProvider>
          </Provider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
