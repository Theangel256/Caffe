const guildSystem = require("../../../../utils/models/guilds");
import { getSession } from "../../../../middleware/session.js";
const { getOrCreateDB } = require("../../../../utils/functions.js");

export async function POST({ params, request }) {
  const user = getSession(request);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const idserver = params.id;
  const form = await request.formData();
  const logs_ID = form.get("logs_ID");
  await getOrCreateDB(guildSystem, { guildID: idserver });

  if (!logs_ID || logs_ID === "no_select") {
    await guildSystem.updateOne({ guildID: idserver }, { $unset: { channelLogs: "" } });
  } else {
    await guildSystem.updateOne({ guildID: idserver }, { $set: { channelLogs: logs_ID } });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: `/dashboard/${idserver}` },
  });
}


