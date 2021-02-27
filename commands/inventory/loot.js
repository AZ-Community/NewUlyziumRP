const Discord = require('discord.js');

exports.run = async ( client, message, args) => {


	if(args.length == 0) return message.channel.send(client.sendEmbed(
		"Loot",
		":x: Il manque le nom du monstre",
		"RED"
	));	

	var add = 0;
	var resultat = "";
	for(var i = 0; i < exampleLoot.length; i++){
		add += Math.floor(Math.random() * Math.floor(exampleLoot[i].prob));		
		/* ITEM RARE */
		if(add == 100){ 
			resultat += "ITEM SPECIAL\n";
		}else if (add < 100 && exampleLoot[i].prob != 1) {
			resultat += `Nom: ${exampleLoot[i].nom }\nQuantité:${Math.floor((add/100) *(exampleLoot[i].qtmax - exampleLoot[i].qtmin + 1)) + exampleLoot[i].qtmin} \n`;
		}
	}
	
	message.channel.send(client.sendEmbed(
		"Loot",
		resultat,
		"GREEN"
	));

}

exports.help = {
	name: "loot",
	description: 'Récupérer les loots d\'un monstre ',
	usage: "=loot <Nom du monstre>",
	example: "=loot"
}

exports.conf = {
	aliases: []
}
