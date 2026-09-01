"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AdminLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin");
      } else {
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-green" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">Admin Login</h1>
          <p className="text-charcoal-light text-sm">Sign in to manage Devi Pickles</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-cream-dark/40 p-8 shadow-sm space-y-5">
          {error && (
            <div className="bg-red/10 border border-red/30 text-red rounded-lg p-3 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="admin@devipickles.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-400 hover:text-green">← Back to store</Link>
        </div>
      </div>
    </div>
  );
}
