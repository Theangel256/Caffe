let lastRequests = new Map();

export async function onRequest({ request }, next) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const now = Date.now();
  const recent = lastRequests.get(ip);

  if (recent && now - recent < 2000) {
    return new Response("Too many requests", { status: 429 });
  }

  lastRequests.set(ip, now);
  return next();
}
