import { serialize } from "cookie";
import { SESSION_STORE } from "./callback.js";

export async function GET({ request }) {
  const cookies = request.headers.get("cookie") || "";
  const match = cookies.match(/session_id=([^;]+)/);
  if (match) {
    const id = match[1];
    SESSION_STORE.delete(id);
  }

  const cookie = serialize("session_id", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": cookie,
    },
  });
}
