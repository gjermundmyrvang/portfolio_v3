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
  const [user, setUser] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user.email ?? "");
        setAuthorized(true);
      }
    };
    checkSession();
  }, [router]);

  if (!authorized) return null;

  return (
    <div>
      <header className="border-b border-neutral-300 dark:border-neutral-700 py-4 px-2 sm:px-0 text-sm font-medium flex justify-between">
        <span>
          <pre className="text-xl font-bold">Admin Page</pre>
          {!(user.trim() === "") && (
            <pre className="text-sm font-thin">User: {user}</pre>
          )}
        </span>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/login");
          }}
          className="text-gray-500 hover:text-red-700 hover:cursor-pointer inline-flex items-center gap-2"
        >
          <pre>Sign Out</pre>
          <span>
            <LogOut size={18} />
          </span>
        </button>
      </header>
      <main className="p-6 sm:p-0 sm:py-4">{children}</main>
    </div>
  );
}
