const database = require('../DatabaseManager');
const cooldownmute = new database('cooldownmute');
module.exports = function iteracionMute(client)  {
    const guilds = cooldownmute.all();
    for(const guild_id in guilds) {
        const servidor = client.guilds.cache.get(guild_id);
        if(!servidor) {
            cooldownmute.delete(guild_id);
            continue;
        }

        const muted_role = servidor.roles.cache.find(r => r.name == 'Muted');
        for(const user_id in guilds[guild_id]) {
            const member = servidor.members.cache.get(user_id);
            if(!member) {
                    cooldownmute.delete(`${guild_id}.${user_id}`);
                continue;
            }
            if(Date.now() >= guilds[guild_id][user_id]) {
                if(muted_role && member.roles.cache.has(muted_role)) {
                    member.roles.remove(muted_role.id).catch(err => console.log(err.message));
                    console.log("asd")
                }
            cooldownmute.delete(`${guild_id}.${user_id}`);
            }
        }
    }
}