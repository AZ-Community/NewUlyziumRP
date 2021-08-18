const Discord = require("discord.js");

exports.run = async(client, message, args) => {
	var monsterSelection = "";
	const monsters = await client.monsterManager.getMobs(message.channel.id);
	if(!args[0]){
		//On vérifie si des monstres existes.
		if(monsters.size == 0) return message.channel.send(client.sendEmbed(
		"", "Les monstes sont si silencieux... gare à vous joueur.\n:warning: un monstre peut vous attaquer à tout moment", 
		"RED"));

		for(const [key,item] of monsters){
			await client.monsterManager.getMonsterWithName(item.name).then(thisMonster => {
				monsterSelection += key + " "+ thisMonster.name + ` | [ PV ${thisMonster.life}  / ATK ${thisMonster.atk}]\n`;	
			});
		}
		//On affiche l'embed si tout se déroule correctement
		message.channel.send(client.classicalEmbed(
			"Votre adversaire ?",
			`\`\`\` ${monsterSelection}\`\`\``,
			"#222222"
		));
	}else{
		if(monsters.has(parseInt(args[0]))){
				monsterSelection = client.classicalEmbed(
					"",
					`> **Le Slime vous scrutant du regard au loin, semblerait manigancer une audacieuse approche.\n` +
				  `> Intelligemment, Il se faufile dans votre armure, et pénètre l'un de vos nombreux orifices.\n` +
          `> Après être ressorti, il vous causera des dégâts internes considérable.**`,
					"#EEEEEE"
				);
			message.channel.send(monsterSelection);
		}
	}
}

exports.help = {
	name: "combat",
	description: "Visualiser les monstres dans la zone",
	usage: "=combat",
	example: "=combat"
}

exports.conf = {
	aliases: ["cb"]
}
