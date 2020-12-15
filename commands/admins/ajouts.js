const Discord = require('discord.js');

exports.run = async (client, message, args) => {
	if(!client.userIsStaff(message.guild, message.author))return message.channel.send(
		{embed: {color: "RED", description: `:x: <@${message.author.id}>, cette commande est réservée aux membres du staff.`}});	
	const titleEmbed = "Administration des items";
	const myEmbed = await client.sendEmbed(
		titleEmbed,
		":one: - Ajouter un type. \n:two: - Ajouter un item",
		"RED", 
		"https://mir-s3-cdn-cf.behance.net/project_modules/disp/3ce18030283093.561c24a8eb950.gif"
	);

	
	message.channel.send(myEmbed); 
	//Les réactions	
	message.react("❌"); message.react("1️⃣"); message.react("2️⃣"); message.react("3️⃣");
	console.log(client.choiceGUI(message, [
		["Donnez le nom de votre type"]
		["Donnez le nom de votre type", "Donnez le nom de votre item"]
	]));



}

exports.help = {
    name: "items",
    description: "Cette commande va permettre de gérer les items",
    usage: "=items",
    example: "=items"
}

exports.conf = {
    aliases: ["item"]
}
