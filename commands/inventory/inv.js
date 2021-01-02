const Discord = require('discord.js');

exports.run = async (client, message, args) => {
	const iManage = new client.itemsManagement();
	var inventory,description = "";
	var inventoryEmbed = new Discord.MessageEmbed()
	.setTitle("`S a c | 🏵️ `")
	.setThumbnail('https://media.discordapp.net/attachments/743582758554566659/763443002080624680/hira-bilal-bag-removebg-preview.png')
	.setColor('GREEN');
	var member = message.author.id;
	if(args[0] && client.userIsStaff(message.guild, message.author)) member = message.guild.members.cache.get(message.mentions.users.first().id).user.id;
	inventoryEmbed.addField("╺─────み─────╸", `Inventaire de <@${member}>`);
	client.con.query(`SELECT * FROM inventory WHERE idplayer = ${(member)}`, (err, rows) => { 
		if(rows.length != 0){
			for(var i=0; i < rows.length; i++){ 
				inventory += `Nom :**${client.itemInformation(rows[i].itemid)}** | Quantité **${rows[i].quantity}**\n`	

			}
			inventoryEmbed.addField(inventory, "");  
		}
		inventoryEmbed.addField("╺─────み─────╸" ,"_**Z i u m's :gem:**_\n [ 88 ] \n**_P i è c e s :moneybag:_** \n`Or` 100\n`Argent` 53\n`Cuivre` 85");
		message.channel.send(inventoryEmbed);
	});		
}

exports.help = {
    name: "inv",
    description: "Visualiser son inventaire",
    usage: "=inv",
    example: "=inv"
}

exports.conf = {
    aliases: ["inventory"]
}
