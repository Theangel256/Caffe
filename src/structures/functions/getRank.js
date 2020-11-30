module.exports = async function (users, message)  {
    const userlist = [];
    for(const key in users) {
        const usuario = message.guild.members.cache.has(key) ? message.guild.members.cache.get(key).user.tag : message.client.users.fetch(key).tag;
        userlist.push([usuario, users[key].lvl, users[key].xp]);
    }
    userlist.sort((user1, user2) => {
        return user2[1] - user1[1] || user2[2] - user1[2];
    });
    return userlist;
}