"use client";

import "../globals.css";
import { RecoilRoot } from "recoil";
import SideBarAdmin from "@/components/global/header/SideBarAdmin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const getMe = async () => {
    const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/me-admin", {
      method: "GET",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    const res = await req.json();
    if (req.ok) {
      localStorage.setItem("auth-admin", JSON.stringify({ login: true }));
      localStorage.setItem("admin", JSON.stringify(res));
      if (
        pathname ===
        (process.env.NODE_ENV === "production"
          ? "/admin/auth/login"
          : "/admin/auth/login")
      ) {
        router.replace(process.env.NODE_ENV === "production" ? "/" : "/admin");
      }

      return true;
    } else {
      localStorage.setItem("auth-admin", JSON.stringify({ login: false }));
      router.replace(
        process.env.NODE_ENV === "production"
          ? "/admin/auth/login"
          : "/admin/auth/login"
      );
      return false;
    }
  };

  useEffect(() => {
    getMe();
  }, [pathname]);

  return (
    <html lang="en">
      <body className="overflow-y-hidden">
        <RecoilRoot>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            draggable
          />
          <div className="flex w-full text-sm">
            {pathname !== "/admin/auth/login" && <SideBarAdmin />}
            <div className={`w-full bg-primary-50 overflow-y-scroll h-screen`}>
              {children}
            </div>
          </div>
        </RecoilRoot>
      </body>
    </html>
  );
}
