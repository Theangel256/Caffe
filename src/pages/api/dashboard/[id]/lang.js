import guildSystem from "../../../../utils/models/guilds.js";
import { getSession } from "../../../../middleware/index.ts";
import { getOrCreateDB } from "../../../../utils/functions.js";

export async function POST({ params, request }) {
  const user = await getSession(request);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const idserver = params.id;
  const form = await request.formData();
  const lang = form.get("language");
  await getOrCreateDB(guildSystem, { guildID: idserver });

  if (lang && lang !== "no_select") {
    await guildSystem.updateOne({ guildID: idserver }, { $set: { language: lang } });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: `/dashboard/${idserver}` },
  });
}