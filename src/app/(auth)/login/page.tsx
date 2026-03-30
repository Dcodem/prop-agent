"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      router.push("/cases");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="w-full max-w-[480px]">
      {/* Card */}
      <div className="bg-white rounded-lg shadow-[0_24px_48px_-12px_rgba(13,28,46,0.08)] p-8 md:p-12 flex flex-col items-center">
        {/* Brand Identity */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-[#00838f] mb-4">
            <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0d1c2e] mb-2" style={{ fontFamily: "'Manrope', sans-serif" }}>PropAgent</h1>
          <p className="text-[#3e494a] font-medium">Portfolio Management Excellence</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#0d1c2e] ml-1" htmlFor="email">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[#6e797b] text-xl group-focus-within:text-[#006872] transition-colors">mail</span>
              </div>
              <input
                className="w-full pl-12 pr-4 py-4 bg-[#eff4ff] border-2 border-transparent focus:border-[#006872] focus:ring-0 rounded-[1rem] transition-all text-[#0d1c2e] placeholder:text-[#6e797b]/60"
                id="email"
                name="email"
                placeholder="agent@propmanagement.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="block text-sm font-semibold text-[#0d1c2e]" htmlFor="password">Password</label>
              <a className="text-xs font-bold text-[#006872] hover:text-[#004f56] transition-colors" href="#">Forgot Password?</a>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-[#6e797b] text-xl group-focus-within:text-[#006872] transition-colors">lock</span>
              </div>
              <input
                className="w-full pl-12 pr-4 py-4 bg-[#eff4ff] border-2 border-transparent focus:border-[#006872] focus:ring-0 rounded-[1rem] transition-all text-[#0d1c2e] placeholder:text-[#6e797b]/60"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* CTA Button */}
          <button
            className="w-full bg-[#00838f] text-white py-4 rounded-lg font-bold text-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#00838f]/20 disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In to Dashboard"}
            {!loading && <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>}
          </button>
        </form>

        {/* Secondary Actions */}
        <div className="mt-10 w-full">
          <div className="relative flex items-center justify-center mb-8">
            <div className="flex-grow border-t border-[#bdc9ca]/30"></div>
            <span className="flex-shrink mx-4 text-xs font-bold tracking-widest text-[#6e797b] uppercase">Or Secure Access</span>
            <div className="flex-grow border-t border-[#bdc9ca]/30"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-[#eff4ff] rounded-[1rem] border border-[#bdc9ca]/20 hover:bg-[#e6eeff] transition-colors font-semibold text-sm text-[#3e494a]">
              <span className="material-symbols-outlined text-xl">key</span>
              SSO
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-[#eff4ff] rounded-[1rem] border border-[#bdc9ca]/20 hover:bg-[#e6eeff] transition-colors font-semibold text-sm text-[#3e494a]">
              <span className="material-symbols-outlined text-xl">qr_code_2</span>
              QR Code
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="mt-12 text-sm text-[#3e494a]">
          New to the platform?{" "}
          <Link className="text-[#006872] font-bold hover:underline decoration-2 underline-offset-4" href="/signup">Create an account</Link>
        </p>
      </div>

      {/* Trust Signals */}
      <div className="mt-8 flex items-center justify-center gap-6 opacity-60">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">verified_user</span>
          <span className="text-[10px] font-bold tracking-widest uppercase">256-bit AES</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">cloud_done</span>
          <span className="text-[10px] font-bold tracking-widest uppercase">Systems Online</span>
        </div>
      </div>
    </main>
  );
}
