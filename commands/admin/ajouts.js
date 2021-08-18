const Discord = require('discord.js');

exports.run = async (client, message, args) => {
	if(!client.userIsStaff(message.guild, message.author))return message.channel.send(
		{embed: {color: "RED", description: `:x: <@${message.author.id}>, cette commande est réservée aux membres du staff.`}});	
	const titleEmbed = "『:gear:』Gestion du Roleplay";
	const myEmbed = await client.sendEmbed(
		titleEmbed,
		"\t:books: - Ajouter un type/item. \n:heavy_dollar_sign: - Ajouter un marché/spawn point (mosntre)  dans un salon\n" +
		":bow_and_arrow: - Ajouter des monstres",
		"RED"
	);
	
	message.channel.send(myEmbed);
	//Les réactions
	message.react("❌"); message.react("📚");  message.react("💲"); message.react("🏹"); 
	

	client.choiceGUI(message, [
		[titleEmbed,"Donnez le nom de la liste et de l'item " +
		"\n Exemple [pour créer un item]: `ARMES Gold Knife`" +
		"\n Exemple [pour créer un type]: `ARMES`" +
		"\n :warning: **__Vérifiez bien votre message__**!", "ORANGE", "", "addingItem"	],

		[titleEmbed,"Ajouter un marché, dans le salon que vous voulez !"+
		"\nPour un marché : `<id du salon> toMarket`" +
		"\nPour un spawn point: `<id du salon> toMonster`" +
		"\n `<Id du salon>`, obtenable à l'aide du mode développeur" +
		"\nLégende : <> = Important à mettre",
		"ORANGE", "", "addingMarkChannel"],

		[titleEmbed,"Ajouter un monstre!" +
		"\nExemple: [Crée un nouveau monstre] <`Nom du monstre`>|<point d'Attaque>|<point de Vies>" + 
		"\nLégende : <> = Important à mettre",
		"ORANGE","", "addingMonster"],


	]);
}

exports.help = {
    name: "ajouts",
    description: "Cette commande va permettre de gérer le roleplay",
    usage: "=ajouts",
    example: "=ajouts"
}

exports.conf = {
    aliases: ["ajt", "add"]
}
