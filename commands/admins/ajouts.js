const Discord = require('discord.js');

exports.run = async (client, message, args) => {
	if(!client.userIsStaff(message.guild, message.author))return message.channel.send(
		{embed: {color: "RED", description: `:x: <@${message.author.id}>, cette commande est réservée aux membres du staff.`}});	
	const titleEmbed = "Gestion des items";
	const myEmbed = await client.sendEmbed(
		titleEmbed,
		":one: - Ajouter un type. \n:two: - Ajouter un item",
		"RED", 
		"https://mir-s3-cdn-cf.behance.net/project_modules/disp/3ce18030283093.561c24a8eb950.gif"
	);
	
	message.channel.send(myEmbed);
	//Les réactions	
	message.react("❌"); message.react("1️⃣");  message.react("2️⃣");
	

	client.choiceGUI(message, [
		[titleEmbed,"Donnez le nom de votre type", "ORANGE", myEmbed.image.url],
		[titleEmbed,"Donnez le nom de la liste et de l'item !", "ORANGE", myEmbed.image.url]
	]);



}

exports.help = {
    name: "ajouts",
    description: "Cette commande va permettre de gérer les items",
    usage: "=ajouts",
    example: "=ajouts"
}

exports.conf = {
    aliases: ["ajt"]
}
