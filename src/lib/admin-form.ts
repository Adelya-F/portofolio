/**
 * Turns a failed admin API response into a message worth putting on screen.
 *
 * The dashboard talks to the API routes with fetch, so an expired session
 * comes back as a silent 401 rather than a redirect to the login page — which
 * looks exactly like "saving did nothing". This names that case explicitly.
 */
export async function readApiError(response: Response): Promise<string> {
  if (response.status === 401) {
    return "Your session expired, so nothing was saved. Log in again in another tab, then press Save once more.";
  }

  const body = await response.json().catch(() => null);
  if (body && typeof body.error === "string") return body.error;

  return `Something went wrong (HTTP ${response.status}). Please try again.`;
}
