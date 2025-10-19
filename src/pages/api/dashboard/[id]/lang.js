const guildSystem = require("../../../../utils/models/guilds");
import { getSession } from "../../../../middleware/session.js";
const { getOrCreateDB } = require("../../../../utils/functions.js");

export async function POST({ params, request }) {
  const user = getSession(request);
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