"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const PUBLIC_PATHS = ["/login", "/signup"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const isPublic = PUBLIC_PATHS.includes(pathname);

    if (!token && !isPublic) {
      router.replace("/login");
    }
  }, [pathname, router]);

  return <>{children}</>;
}