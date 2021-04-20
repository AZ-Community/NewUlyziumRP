const Discord = require("discord.js");

exports.run = async(client, message, args) => {
	message.channel.send(client.classicalEmbed(
		"Zone - | I N T I T U L É | -",
		"Monstre1 [ 40 :heart: ] - 10 :fire: \n" +
		"Monstre2 [ 70 :heart: ] - 15 :fire: \n" +
		"Monstre3 [ 30 :heart: ] - 5 :fire: \n",
		"#222222"
	));
}

exports.help = {
	name: "attack",
	description: "Affronter un monstre",
	usage: "=",
	example: "=attaque"
}

exports.conf = {
	aliases: ["attaque", "attaquer"]
}
