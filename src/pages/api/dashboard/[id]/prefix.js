import guildSystem from "../../../../utils/models/guilds";
import { getSession } from "../../../../middleware/session.js";
import { getOrCreateDB } from "../../../../utils/db.js";

export async function POST({ params, request }) {
  const user = getSession(request);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const idserver = params.id;
  const form = await request.formData();
  const newPrefix = form.get("newPrefix");
  await getOrCreateDB(guildSystem, { guildID: idserver });

  if (newPrefix && newPrefix.toString().length > 0) {
    await guildSystem.updateOne({ guildID: idserver }, { $set: { prefix: newPrefix.toString() } });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: `/dashboard/${idserver}` },
  });
}