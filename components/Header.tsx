"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const isDashboard =
    pathname.includes("/dashboard") ||
    pathname.includes("/cases") ||
    pathname.includes("/properties") ||
    pathname.includes("/reports") ||
    pathname.includes("/alerts");

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <header className="bg-[#1e3a8a] text-white shadow-lg">
      <div className="px-4 py-6">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-4 hover:opacity-90 transition-all duration-300 transform hover:scale-105"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
              <div className="w-12 h-12 bg-[#1e3a8a] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">EM</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">e-Malkhana</h1>
              <p className="text-sm text-blue-200">
                Digital Evidence Management System
              </p>
            </div>
          </Link>

          {isDashboard && session && (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-[#1e40af] px-4 py-2 rounded-lg shadow-md">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#1e3a8a]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">
                    {session.user?.name}
                  </span>
                  {(session.user as any)?.role === "ADMIN" && (
                    <span className="text-xs bg-[#ffc107] text-[#856404] px-2 py-0.5 rounded font-bold w-fit">
                      ADMIN
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="bg-[#dc3545] hover:bg-[#c82333] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
