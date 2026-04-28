"use client";
import { supabase } from "@/src/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/admin");
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border dark:border-neutral-700 px-3 py-2 rounded text-sm"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="border dark:border-neutral-700 px-3 py-2 rounded text-sm"
        />

        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 py-2 rounded hover:opacity-90 transition disabled:opacity-50 hover:cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
