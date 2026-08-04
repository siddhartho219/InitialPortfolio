"use client";

import { LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { useAuth } from "@/components/cms/AuthProvider";

export default function LoginForm() {
  const { user, loading, login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, router, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (authError) {
      setError(
        authError instanceof Error
          ? authError.message
          : "Unable to sign in with that email and password.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setGoogleSubmitting(true);

    try {
      await loginWithGoogle();
      router.replace("/dashboard");
    } catch (authError) {
      setError(
        authError instanceof Error
          ? authError.message
          : "Unable to sign in with that Google account.",
      );
    } finally {
      setGoogleSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10 text-foreground">
      <form
        className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-2xl shadow-black/20"
        onSubmit={handleSubmit}
      >
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">Portfolio CMS</p>
          <h1 className="mt-1 text-2xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Authorized accounts only.
          </p>
        </div>

        <button
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          disabled={googleSubmitting || submitting}
          onClick={handleGoogleSignIn}
          type="button"
        >
          <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-sm font-bold text-slate-900">
            G
          </span>
          {googleSubmitting ? "Opening Google..." : "Sign in with Google"}
        </button>

        <div className="mb-5 flex items-center gap-3 text-xs uppercase text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <label className="mb-4 block text-sm">
          <span className="mb-2 block text-muted-foreground">Email</span>
          <span className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <input
              autoComplete="email"
              className="w-full bg-transparent outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </span>
        </label>

        <label className="mb-5 block text-sm">
          <span className="mb-2 block text-muted-foreground">Password</span>
          <span className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
            <LockKeyhole className="h-4 w-4 text-muted-foreground" />
            <input
              autoComplete="current-password"
              className="w-full bg-transparent outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </span>
        </label>

        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        <button
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting || googleSubmitting}
          type="submit"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
