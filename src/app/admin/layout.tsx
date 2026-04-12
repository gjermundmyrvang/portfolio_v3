"use client";
import { supabase } from "@/src/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setAuthorized(true);
      }
    };
    checkSession();
  }, [router]);

  if (!authorized) return null;

  return (
    <div>
      <header className="border-b border-neutral-300 py-4 px-2 sm:px-0 text-sm font-medium flex justify-between">
        <span>Admin Page</span>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/login");
          }}
          className="text-gray-500 hover:text-black hover:cursor-pointer inline-flex items-center gap-2"
        >
          Sign out
          <span>
            <LogOut />
          </span>
        </button>
      </header>
      <main className="p-6 sm:p-0 sm:py-4">{children}</main>
    </div>
  );
}
