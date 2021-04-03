const Discord = require('discord.js');

exports.run = async ( client, message, args) => {
	var nameMonster = "";
	if(args.length == 0) return message.channel.send(client.sendEmbed(
		"Loot",
		":x: Il manque le nom du monstre",
		"RED"
	));	
	
	for(var i = 0; i < args.length; i++) nameMonster = (i != args.length) ? nameMonster += args[i] + " " : nameMonster +=  args[i];	
	var add = 0;
	var resultat = "";
	
	client.con.query(`SELECT * FROM monsterLoot`, (err, rows) => {
		for(var i = 0; i < rows.length; i++){
			if(rows[i].nameMonster.localeCompare(nameMonster) == 0){
				var json = JSON.parse(rows[i].lootItems);
				var value = Object.values(json);
				if(value.length == 1){
					add += Math.floor(Math.random() * Math.floor(parseInt(value[2])));		
					var itemNom= client.itemInformation(value[0]);
					resultat += `Nom: ${itemNom}\nQuantité:${Math.floor((add/100) *(parseInt(value[2]) - parseInt(value[3]) + 1)) + parseInt(value[2])} \n`;	
					message.channel.send(client.sendEmbed(
						"Loot",
						resultat,
						"GREEN"
					));
				}else{
					for(var j=0; j < value.length; j++){			
						add += Math.floor(Math.random() * Math.floor(parseInt(value[j].qtmin)));		
						var itemNom= client.itemInformation(value[j].item);
						resultat += `Nom: ${itemNom} - Quantité:${Math.floor((add/100) *(parseInt(value[j].qtmin) - parseInt(value[j].qtmax) + 1)) + parseInt(value[j].qtmin)} \n`;	
					}
					message.channel.send(client.sendEmbed(
						"Loot",
						resultat,
						"GREEN"
					));
				}
			}
		}
	});


	
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
