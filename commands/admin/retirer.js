const Discord = require('discord.js');

exports.run = async (client, message, args) => {
	if(!client.userIsStaff(message.guild, message.author))return message.channel.send(
        {embed: {color: "RED", description: `:x: <@${message.author.id}>, cette commande est réservée aux membres du staff.`}});
        	
    const titleEmbed = "『:gear:』Gestion du Roleplay";
	const myEmbed = await client.sendEmbed(
		titleEmbed,
		"\t:books: - Retirer un type/item. \n:heavy_dollar_sign: - Retirer un marché d'un salon\n:bow_and_arrow: - Retirer un loot/monstre",
		"RED", 
	);
	
	message.channel.send(myEmbed);
	//Les réactions	
	message.react("❌"); message.react("📚");  message.react("💲"); message.react("🏹");	
	

	client.choiceGUI(message, [

		[titleEmbed,"Donnez le nom de la liste et de l'item " +
		"\n Exemple [pour supprimer un item]: `TYPES idObjet`" +
		"\n Exemple [pour supprimer un type]: `TYPES`" +
		"\n :warning: **__Vérifiez bien votre message__**!", "ORANGE", "", "removingItem"],

		[titleEmbed,"Donnez l'id de l'item à vendre ou du marché à supprimé " +
		"\n :warning: **__Vérifiez bien votre message__**!", "ORANGE", "", "removingMarket"],	
			
		[titleEmbed,"Donnez le nom du monstre à supprimer ou l'id du loot" +
		"\n :warning: **__Vérifiez bien votre message__**!", "ORANGE", "", "removingLoot"]

	]);

}

exports.help = {
    name: "retirer",
    description: "Cette commande va permettre de gérer les items",
    usage: "=retirer",
    example: "=retirer"
}

exports.conf = {
    aliases: ["rmv", "remove"]
}
