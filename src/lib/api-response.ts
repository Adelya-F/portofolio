import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function jsonValidationError(error: ZodError) {
  // Surface the first problem in `error` so the admin forms can show something
  // actionable ("slug: Slug is required") instead of a bare "Validation failed".
  const [first] = error.issues;
  const field = first?.path.join(".");
  const message = first
    ? `${field ? `${field}: ` : ""}${first.message}`
    : "Validation failed";

  return NextResponse.json({ error: message, issues: error.issues }, { status: 422 });
}

export function jsonNotFound(resource: string) {
  return jsonError(`${resource} not found`, 404);
}
