module.exports = function getMember(message, args, autor = true)  {
    let search = args.join(' '),
        result;
    if (!search) {
        result = autor === true ? message.member : null;
    } else {
        search = search.toLowerCase();
        result = message.mentions.members.first() || 
        message.guild.members.resolve(search) ||
        message.guild.members.cache.find(e => e.user.username.toLowerCase().includes(search) ||
        e.user.tag.toLowerCase().includes(search) ||
        e.displayName.toLowerCase().includes(search)) || 
        message.member
}
return result;
}