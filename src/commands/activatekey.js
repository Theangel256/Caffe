module.exports.run = async (client, message, args) => {
    const premium = new client.database('premium');
    if(!args[0]) 
    return message.channel.send(`Tienes que otorgarme una licencia para poder validar tu subscripcion\nPuedes obtenerla en: ${process.env.URL}/premium`);
    const key = await premium.get(`${message.guild.id}.license`)
    if(key === args[0]) {
        premium.set(`${message.guild.id}.enable`,true)
        premium.set(`${message.guild.id}.time`, Date.now() + 2.592e+9)
        return message.channel.send('Premium Activado para este servidor!');
    }else{
        return message.channel.send('Licencia invalida!');
    }
}
module.exports.help = {
	name: 'activatekey',
	description: '',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: [],
	ownerOnly: true,
};