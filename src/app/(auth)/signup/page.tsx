"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

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
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

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

  return (
    <form onSubmit={handleSignup} className="space-y-4 rounded-lg bg-white p-8 shadow">
      <h1 className="text-2xl font-bold">Create your account</h1>

      {error && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your name</label>
        <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded border border-gray-300 px-3 py-2" />
      </div>

      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company name</label>
        <input id="companyName" type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="mt-1 block w-full rounded border border-gray-300 px-3 py-2" />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded border border-gray-300 px-3 py-2" />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone (for SMS notifications)</label>
        <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full rounded border border-gray-300 px-3 py-2" />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded border border-gray-300 px-3 py-2" />
      </div>

      <button type="submit" disabled={loading} className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
        {loading ? "Creating account..." : "Sign up"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
      </p>
    </form>
  );
}
