const Discord = require('discord.js');

exports.run = async (client, message, args) => {
	if(!client.userIsStaff(message.guild, message.author))return message.channel.send(
		{embed: {color: "RED", description: `:x: <@${message.author.id}>, cette commande est réservée aux membres du staff.`}});	
	const titleEmbed = "『:gear:』Gestion du Roleplay";
	const myEmbed = await client.sendEmbed(
		titleEmbed,
		"\t:books: - Modifier un type/item. \n:heavy_dollar_sign: : - Modifier  un marché dans un salon\n:bow_and_arrow: Modifier les loots d'un monstre",
		"RED", 
	);
	
	message.channel.send(myEmbed);
	//Les réactions	

	message.react("❌"); message.react("📚");  message.react("💲"); message.react("🏹");

	client.choiceGUI(message, [
		[titleEmbed,"AIDE" +
		"\n `TYPE itemID setDamage 10` => Pour pouvoir changer les points d'attaque" +
		"\n `TYPE itemID setProtection 10` => Pour pouvoir changer les points de protection " +
		"\n `TYPE itemID setDescription <votre phrase>` => Pour émettre une description à un item" +
		"\n `TYPE itemID setCraftable <id d'un item> <quantité> | <id d'un autre item> quantité> | etc...` => Pour émettre le schéma du craft." + 
		"\n :warning: **__Vérifiez bien votre message__**!", "ORANGE", "", "modifingItem"],

		[titleEmbed, "AIDE"+
		"\n `idChannel addBuy price TYPE;itemID`"+
		"\n `idChannel modifBuy price TYPE;itemID`" +
		"\n `idChannel removeBuy TYPE;itemID`"+
		"\n :warning: **__Vérifiez bien la syntaxe !__**", "ORANGE", "", "modifingMarket"],

		[titleEmbed,"AIDE" +
		"\n `<Nom du monstre>|<Loot 1;Probabilité,Prob2,Prob3> <Loot2;etc...>`"+
		"\n :warning: **__Vérifiez bien la syntaxe !__**", "ORANGE", "", "modifingLoot"]

	]);


}

exports.help = {
    name: "modification",
    description: "Cette commande va permettre de gérer les items",
    usage: "=modification",
    example: "=modif"
}

exports.conf = {
    aliases: ["modif"]
}
