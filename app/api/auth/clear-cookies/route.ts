import { NextResponse } from "next/server";

export function POST() {
  const response = NextResponse.json({ message: "Cookies cleared" });

  response.cookies.set("next-auth.session-token", "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: -1,
    path: "/",
  });
  response.cookies.set("__Secure-next-auth.session-token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: -1,
    path: "/",
  });
  response.cookies.set("__Host-next-auth.csrf-token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: -1,
    path: "/",
  });
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: -1,
    path: "/",
  });

  return response;
}
