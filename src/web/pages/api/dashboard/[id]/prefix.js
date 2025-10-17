// src/pages/api/dashboard/[id]/prefix.js
import guildSystem from "../../../../utils/models/guilds";
import { getOrCreateDB } from "../../../../utils/functions";    
    
export async function POST({ params, request, locals }) {
  const guildId = params.id;
  const form = await request.formData();
  const newPrefix = form.get("newPrefix");

  if (!newPrefix || newPrefix.length === 0) {
    return new Response("Invalid prefix", { status: 400 });
  }

  await guildSystem.updateOne({ guildID: guildId }, { $set: { prefix: newPrefix } });
  return Response.redirect(`/dashboard/${guildId}`);
}
