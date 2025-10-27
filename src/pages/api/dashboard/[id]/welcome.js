const guildSystem = require("../../../../utils/models/guilds");
import { getSession } from "../../../../middleware/index.ts";
const { getOrCreateDB } = require("../../../../utils/functions.js");

export async function POST({ params, request }) {
  const user = getSession(request);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const idserver = params.id;
  const form = await request.formData();
  const channel_ID = form.get("channel_ID");
  await getOrCreateDB(guildSystem, { guildID: idserver });

  if (!channel_ID || channel_ID === "no_select") {
    await guildSystem.updateOne({ guildID: idserver }, { $unset: { channelWelcome: "" } });
  } else {
    await guildSystem.updateOne({ guildID: idserver }, { $set: { channelWelcome: channel_ID } });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: `/dashboard/${idserver}` },
  });
}