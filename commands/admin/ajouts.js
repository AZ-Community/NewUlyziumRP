const Discord = require('discord.js');

exports.run = async (client, message, args) => {
	if(!client.userIsStaff(message.guild, message.author))return message.channel.send(
		{embed: {color: "RED", description: `:x: <@${message.author.id}>, cette commande est réservée aux membres du staff.`}});	
	const titleEmbed = "『:gear:』Gestion du Roleplay";
	const myEmbed = await client.sendEmbed(
		titleEmbed,
		"\t:books: - Ajouter un type/item. \n:heavy_dollar_sign: - Ajouter un marché dans un salon\n" +
		":bow_and_arrow: - Ajouter des monstres\n:alien: - Ajouter un channel pour la génération des monstres",
		"RED", 
	);
	
	message.channel.send(myEmbed);
	//Les réactions
	message.react("❌"); message.react("📚");  message.react("💲"); message.react("🏹"); message.react("👽");
	

	client.choiceGUI(message, [
		[titleEmbed,"Donnez le nom de la liste et de l'item " +
		"\n Exemple [pour créer un item]: `ARMES Gold Knife`" +
		"\n Exemple [pour créer un type]: `ARMES`" +
		"\n :warning: **__Vérifiez bien votre message__**!", "ORANGE", "", "addingItem"	],

		[titleEmbed,"Ajouter un marché, dans le salon que vous voulez !"+
		"\n `<Id du salon>`, obtenable à l'aide du mode développeur"
		, "ORANGE", "", "addingMarket"],

		[titleEmbed,"Ajouter un monstre!" +
		"\nExemple: [Crée un nouveau monstre] <`Nom du monstre`>|<point d'Attaque>|<point de Vies>" + 
		"\nLégende : <> = Important à mettre",
		"ORANGE","", "addingMonster"],

		[titleEmbed,"Génération des monstres" +
		"\nIl permet d'ajouter ce point de spawn au monstre`",
		"ORANGE","", "addingMonsterSP"]

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
