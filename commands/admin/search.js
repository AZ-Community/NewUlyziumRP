const Discord = require('discord.js');

exports.run = async (client, message, args) => {
	if(args.length < 1) return message.channel.send(client.sendEmbed(	
		"ERREUR",
		"Il me faut au moins **UN** mot clé ou plus !",
		"RED", 
	));
	for(var i= 0; i < args.length; i++){
		var itemFound = client.researchItem(args[i]);
		var send = "";
		for (var j = 0; j < itemFound.length; j++){
			send += `${itemFound[j]} \n`;
		}
		message.channel.send(client.sendEmbed(
			"Search Engine !",
			"Voici mes trouvailles ! \n" + send,
			"GREEN"
		));
	}
}

exports.help = {
    name: "search",
    description: "Cette commande va permettre de chercher les items",
    usage: "=search",
    example: "=search"
}

exports.conf = {
    aliases: ["search", "sitem"]
}
