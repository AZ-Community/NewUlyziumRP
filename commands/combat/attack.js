const Discord = require("discord.js");

exports.run = async(client, message, args) => {
	client.con.query(`SELECT * FROM monsterChannel WHERE idChannel = ${message.channel.id}`, (err, rows) => {
		if(rows.length == 0) return message.channel.send(client.sendEmbed(
			"Ce n'est pas un endroit pour des monstres",
			"",
			"RED"
		));
		const monsters = JSON.parse(rows[0].monsters);
		//On vérifie si des monstres existes.
		if(Object.keys(monsters).length == 0) return message.channel.send(client.classicalEmbed(
				"Zone - | I N T I T U L É | -",
				"Aucun monstre dans la Zone...",
				"#222222"
		));

		message.channel.send(client.classicalEmbed(
				"Zone - | I N T I T U L É | -",
				"Monstre1 [ 40 :heart: ] - 10 :fire: \n" +
				"Monstre2 [ 70 :heart: ] - 15 :fire: \n" +
				"Monstre3 [ 30 :heart: ] - 5 :fire: \n",
				"#222222"
		));
	});

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
