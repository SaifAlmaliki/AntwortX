"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_PASSWORD = process.env.GEO_ADMIN_PASSWORD || "";
const ADMIN_SECRET = process.env.GEO_ADMIN_SECRET || "dev-secret-change-in-production";
const COOKIE_NAME = "geo-admin-auth";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;

  if (!password || password !== ADMIN_PASSWORD) {
    return { error: "Invalid password" };
  }

  const expiresAt = Date.now() + COOKIE_MAX_AGE * 1000;
  const token = btoa(JSON.stringify({ secret: ADMIN_SECRET, expiresAt }));

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/admin/login");
}
