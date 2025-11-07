import React, { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import bgCircuit from "@/assets/background.png"; // your background image

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBanner(null);

    const clean = code.replace(/\D/g, "");
    if (clean.length !== 6) {
      setBanner({ type: "error", msg: "Please enter a valid 6-digit code." });
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // mock
    const isOk = clean === "123456"; // mock success code

    setBanner(
      isOk
        ? { type: "success", msg: "Email verified successfully. You can now log in." }
        : { type: "error", msg: "Invalid or expired code. Please try again." }
    );
    setLoading(false);
  }

  return (
    <div className="relative min-h-screen text-slate-100">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bgCircuit})` }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-950/70" />

      {/* Content */}
      <div className="relative">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur p-6 shadow">
            <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>
            <p className="mt-2 text-slate-300">
              We sent a 6-digit code to your email. Enter it below to verify your account.
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
              <label htmlFor="code" className="block text-sm text-slate-300 mb-1">
                6-digit code
              </label>
              <Input
                id="code"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="h-11 bg-slate-900/70 border-slate-700/70 font-mono tracking-widest text-center"
                aria-describedby="code-help"
              />
              <p id="code-help" className="mt-1 text-xs text-slate-400">
                Tip: For this demo, <span className="font-mono">123456</span> succeeds.
              </p>

              <Button
                type="submit"
                disabled={loading}
                className="mt-5 w-full h-11 bg-cyan-500 text-slate-900 hover:bg-cyan-400 disabled:opacity-60"
              >
                {loading ? "Verifying…" : "Verify Email"}
              </Button>
            </form>

            <div className="mt-4 text-sm text-slate-400">
              Didn’t get a code? <button className="underline hover:text-slate-200">Resend</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
