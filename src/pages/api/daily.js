import User from '../../utils/models/users.js';
import { getOrCreateDB } from '../../utils/functions.js';

export const POST = async ({ locals, request }) => {
  const user = locals.user;
  if (!user) return new Response('Unauthorized', { status: 401 });

  const profile = await getOrCreateDB(User, { userID: user.id });

  const canClaim = !profile.lastDaily || (Date.now() - new Date(profile.lastDaily)) >= 24 * 60 * 60 * 1000;
  if (!canClaim) {
    return new Response('Ya reclamaste tu daily hoy.', { status: 400 });
  }

  profile.money += 200;
  profile.lastDaily = new Date();
  await profile.save();

  return new Response(JSON.stringify({ money: profile.money }), {
    headers: { 'Content-Type': 'application/json' }
  });
};