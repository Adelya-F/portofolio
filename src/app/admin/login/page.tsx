import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-xl">
        <h1 className="font-display text-2xl font-semibold">Admin Login</h1>
        <p className="mt-1 text-sm text-muted">
          Sign in to manage your portfolio content.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
