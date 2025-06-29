"use client";
import "./globals.css";
import localFont from "next/font/local";
import { UtilsProvider } from "./context/utils-context";
import { AuthProvider } from "./context/auth-context";

import { Provider } from "react-redux";
import AuthPrompt from "./auth/auth";
import { ToastContainer } from "react-toastify";
// import CreateCommunityPrompt from "./components/create-community-prompt/prompt";
import { store } from "~/lib/redux/store";
import { NextAuthProvider } from "./next-auth-provider";

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
                {/* <CreateCommunityPrompt /> */}

                {children}
              </UtilsProvider>
            </AuthProvider>
          </Provider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
