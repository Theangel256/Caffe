const economy = require('../structures/models/SystemEconomy');
module.exports = async (client, message) => {
	const user = message.author.id
	const moneyUserServer = await economy.findOne({ userID: user});
	let elements = ['100','75', '50'];
	let cacthElements = elements[Math.floor(elements.length * Math.random())];
	let jobs = ['Trabajas en una cafeteria y ganaste $', 'Trabajaste de repartidor de pizas y recibiste $', "Editaste un video de un YouTuber y te pago $"]
	let cacthJobs = jobs[Math.floor(elements.length * Math.random())];
	if(moneyUserServer != null){
        let currentTotalMoney = parseInt(moneyUserServer.money);
        let moreMoney = parseInt(cacthElements);
        moneyUserServer.money = currentTotalMoney + moreMoney;
        await moneyUserServer.save(err => {
          if(err) return console.log(err);    
        })
		return message.channel.send(`> ${cacthJobs}${cacthElements}`)
	} else {
        let newMoneyUserServer = new economy({
          userID: message.author.id,
          money: cacthElements
        });
        await newMoneyUserServer.save(err => {
          if(err) return console.log(err); 
        })
		return message.channel.send(`> ${cacthJobs}${cacthElements}`)
	}
	}
module.exports.help = {
	name: 'work',
	aliases: ['w'],
	description: 'trabaja duro para conseguir dinero!',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['EMBED_LINKS'],
	ownerOnly: false,
};
module.exports.limits = {
	rateLimit: 1,
	cooldown: 300000,
};