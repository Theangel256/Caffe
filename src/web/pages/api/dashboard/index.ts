import { SESSION_STORE } from "../callback.ts";
import { parse } from "cookie";

export async function GET({ request }: { request: Request }) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = parse(cookieHeader) as { [key: string]: string };
  const sessionId = cookies.session_id;
  const user = SESSION_STORE.get(sessionId);

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Filtrar guilds donde el usuario tiene admin
  const guilds = user.guilds.filter((p: { permissions: number; }) => (p.permissions & 8) === 8);

  return new Response(JSON.stringify({ guilds, user }), {
    headers: { "Content-Type": "application/json" },
  });
}
