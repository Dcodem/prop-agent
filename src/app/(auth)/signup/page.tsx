"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  Bot,
  Mail,
  Lock,
  Shield,
  Cloud,
  Loader2,
  AlertCircle,
  User,
  Building2,
  Phone,
} from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      if (!authData.user) throw new Error("Signup failed");
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || null,
          companyName,
        }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to create account");
      }
      router.push("/cases");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006872]/20 focus:border-[#006872] transition-all text-sm";

  return (
    <>
      {/* TopNavBar (Shared Component) - Absolute Positioned per JSON */}
      <header className="w-full top-0 left-0 absolute flex justify-center items-center py-8 z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-[#006872] w-10 h-10 rounded-lg flex items-center justify-center shadow-md">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#006872]">PropAgent</span>
        </Link>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Signup Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">Create your account</h1>
              <p className="text-slate-500 text-sm">Get started with PropAgent</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Name field */}
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1.5" htmlFor="name">Your name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#006872] transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    className={inputClass}
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Company name field */}
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1.5" htmlFor="companyName">Company name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#006872] transition-colors">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <input
                    className={inputClass}
                    id="companyName"
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Sunrise Property Management"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email field */}
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1.5" htmlFor="email">Email address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#006872] transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    className={inputClass}
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Phone field */}
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1.5" htmlFor="phone">
                  Phone{" "}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#006872] transition-colors">
                    <Phone className="h-5 w-5" />
                  </div>
                  <input
                    className={inputClass}
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1.5" htmlFor="password">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#006872] transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    className={inputClass}
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Sign Up Button */}
              <button
                className="w-full bg-[#00838f] hover:bg-[#006872] text-white font-semibold py-3 px-4 rounded-lg shadow-sm shadow-[#00838f]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Sign up"
                )}
              </button>
            </form>

            {/* Footer Link */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link className="font-semibold text-[#006872] hover:underline ml-1" href="/login">Log in</Link>
              </p>
            </div>
          </div>

          {/* Trust Indicator */}
          <div className="mt-8 flex justify-center items-center gap-6 opacity-40 grayscale contrast-125">
            <div className="flex items-center gap-1.5">
              <Shield className="text-sm" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise Secure</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cloud className="text-sm" />
              <span className="text-[10px] font-bold uppercase tracking-widest">99.9% Uptime</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
