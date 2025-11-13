import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/ui/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import bgCircuit from "@/assets/background.png";
import { verifyEmail, ApiError } from "@/lib/api";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") ?? "");
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) setToken(urlToken);
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBanner(null);

    if (!token.trim()) {
      setBanner({ type: "error", msg: "Missing verification token." });
      return;
    }

    setLoading(true);
    try {
      await verifyEmail(token.trim());
      setBanner({ type: "success", msg: "Email verified successfully. You can now log in." });
    } catch (err) {
      setBanner({
        type: "error",
        msg:
          err instanceof ApiError
            ? err.message
            : "Invalid or expired token. Please request a new email.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen text-slate-100">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bgCircuit})` }}
      />
      <div className="absolute inset-0 bg-slate-950/70" />

      <div className="relative">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur p-6 shadow">
            <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>
            <p className="mt-2 text-slate-300">
              Click the verification link from your inbox or paste the token below to finish activating your account.
            </p>

            {banner && (
              <div
                role="alert"
                className={`mt-4 rounded-lg border px-3 py-2 text-sm ${
                  banner.type === "success"
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-rose-500/40 bg-rose-500/10 text-rose-300"
                }`}
              >
                {banner.msg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6">
              <label htmlFor="token" className="block text-sm text-slate-300 mb-1">
                Verification token
              </label>
              <Input
                id="token"
                placeholder="Paste token from email"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="h-11 bg-slate-900/70 border-slate-700/70 font-mono text-center"
                aria-describedby="token-help"
              />
              <p id="token-help" className="mt-1 text-xs text-slate-400">
                Tip: in development the backend prints verification links to the console.
              </p>

              <Button
                type="submit"
                disabled={loading}
                className="mt-5 w-full h-11 bg-cyan-500 text-slate-900 hover:bg-cyan-400 disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </Button>
            </form>

            <div className="mt-4 text-sm text-slate-400">
              Didn't get a link? <button className="underline hover:text-slate-200">Resend</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
