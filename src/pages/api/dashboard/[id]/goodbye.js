import guildSystem from "../../../../utils/models/guilds.js";
import { getSession } from "../../../../middleware/index.ts";
import { getOrCreateDB } from "../../../../utils/functions.js";

export async function POST({ params, request }) {
  const user = await getSession(request);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const idserver = params.id;
  const form = await request.formData();
  const channelID = form.get("channelID");
  await getOrCreateDB(guildSystem, { guildID: idserver });

  if (!channelID || channelID === "no_select") {
    await guildSystem.updateOne({ guildID: idserver }, { $unset: { channelGoodbye: "" } });
  } else {
    await guildSystem.updateOne({ guildID: idserver }, { $set: { channelGoodbye: channelID } });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: `/dashboard/${idserver}` },
  });
}