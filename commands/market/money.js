const Discord = require('discord.js');

exports.run = async (client, message, args) => {

	//S'il n'est pas du staff..
	if(!client.userIsStaff(message.guild, message.author))
			return message.channel.send(client.sendEmbed(
				":x:",
				"Tu n'es pas un membre du staff",
				"RED"
			))
	//Si aucun argument existe
	if(!args[0] || !args[1]) 
			return message.channel.send(exports.help.example);
	
	if (client.users.cache.get(args[0]))
				return message.channel.send(client.sendEmbed(
					":x:",
					"Il ne s'agit pas d'une mention",
					"RED"
				));
	var member  = message.guild.members.cache.get(message.mentions.users.first().id);	
	if(!parseInt(args[2]))
			return message.channel.send(client.sendEmbed(
				":x:",
				"Je ne veux que des chiffres pour modifier le prix",
				"RED"
			));

	switch(args[1].toLowerCase()){
		case "add":
			var change = client.changeMoney(member.user.id, parseInt(args[2]));
			break;
		case "remove":
			var change = client.changeMoney(member.user.id, parseInt(args[2])*-1);
			break;
	}

	return message.channel.send(client.sendEmbed(
		":white_check_mark:",
		change,
		"GREEN"
	));

}

exports.help = {
    name: "money",
    description: "Permet d'acheter un objet du marché.",
    usage: "=money",
    example: "=money <@Mention joueur> <add|remove> <prix>"
}

exports.conf = {
    aliases: ["money"]
}
