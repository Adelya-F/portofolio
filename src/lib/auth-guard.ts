import { auth } from "@/auth";
import { jsonError } from "./api-response";

/**
 * Guards a mutating API route handler. Returns a 401 response to short-circuit
 * with if there's no session, otherwise null so the caller can proceed.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return jsonError("Unauthorized", 401);
  }
  return null;
}
