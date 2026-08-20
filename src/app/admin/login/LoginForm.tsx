"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export function LoginForm() {
  const [error, formAction, isPending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
          Invalid email or password.
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition-all duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
