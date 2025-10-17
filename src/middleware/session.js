import { parse } from "cookie";
import { SESSION_STORE } from "../pages/api/callback.js"; // or move to shared file

export async function onRequest({ request, locals }, next) {
  const cookies = parse(request.headers.get("cookie") || "");
  const sessionId = cookies.session_id;
  if (sessionId && SESSION_STORE.has(sessionId)) {
    locals.user = SESSION_STORE.get(sessionId);
  } else {
    locals.user = null;
  }

  locals.bot = globalThis.client; // optional if you need bot reference
  return next();
}
