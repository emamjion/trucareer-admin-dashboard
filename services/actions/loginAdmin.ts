"use server";

import { LoginFormData } from "@/components/authentication/AdminLoginPage";

export const loginAdmin = async (data: LoginFormData) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    }
  );
  const adminInfo = response.json();

  return adminInfo;
};
