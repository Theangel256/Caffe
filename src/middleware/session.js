import { parse } from "cookie";

// Usa el mismo store que en el callback (exportado globalmente)
import { SESSION_STORE } from "../pages/api/callback.js";

export async function onRequest(context, next) {
  const cookieHeader = context.request.headers.get("cookie");
  const cookies = cookieHeader ? parse(cookieHeader) : {};
  const sessionId = cookies.session_id;

  if (sessionId && SESSION_STORE.has(sessionId)) {
    context.locals.user = SESSION_STORE.get(sessionId);
  } else {
    context.locals.user = null;
  }

  return next();
}

export function getSession(request) {
  const cookieHeader = request.headers.get("cookie");
  const cookies = cookieHeader ? parse(cookieHeader) : {};
  const sessionId = cookies.session_id;

  return SESSION_STORE.get(sessionId);

}

export { SESSION_STORE };