const guildSystem = require("../../../../utils/models/guilds");
import { getSession } from "../../../../middleware/index.ts";
const { getOrCreateDB } = require("../../../../utils/functions.js");

export async function POST({ params, request }) {
  const user = await getSession(request);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const idserver = params.id;
  const form = await request.formData();
  const rol_ID = form.get("rol_ID");
  await getOrCreateDB(guildSystem, { guildID: idserver });

  if (!rol_ID || rol_ID === "no_select") {
    await guildSystem.updateOne({ guildID: idserver }, { $unset: { rolauto: "" } });
  } else {
    await guildSystem.updateOne({ guildID: idserver }, { $set: { rolauto: rol_ID } });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: `/dashboard/${idserver}` },
  });
}