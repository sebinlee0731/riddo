"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const LOGIN_REQUIRED_PATHS = ["/chatlog", "/settings"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const isLoginRequired = LOGIN_REQUIRED_PATHS.some(path => pathname.startsWith(path));

    if (!token && isLoginRequired) {
      router.replace("/login");
    }
  }, [pathname, router]);

  return <>{children}</>;
}