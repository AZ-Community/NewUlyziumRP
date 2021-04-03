const Discord = require('discord.js');

exports.run = async (client, message, args) => {
	const embed = client.sendEmbed("", "", "#fffeb6");
	const types = client.returnType();
	

	embed.addField("`I t e m s | 🏵️ `",  "╺─────み─────╸\n\n:crossed_swords: | Armes⠀⠀⠀⠀⠀⠀:spider_web: | Divers\n\n\n:mechanical_arm: | Armures⠀⠀⠀⠀⠀:meat_on_bone: | Comestibles",true);
	embed.setThumbnail("https://media.discordapp.net/attachments/743582758554566659/824778983103004682/folder-ebook-icon_1.png");
	message.channel.send(embed);

	//Les réactions
	message.react("❌");  message.react("⚔️"); message.react("🕸️"); message.react("🦾");;  message.react("🍖"); 
	
	client.choiceGUI(message, [
		["A r m e s | 🏵️ ","Ils vous donnes toutes les armes de cette catégorie" +
		"\n", "ORANGE", "", "researchItem"],

		["D i v e r s | 🏵️ ","Ils vous donnes toutes les armes de cette catégorie" +
		"\n", "ORANGE", "", "researchItem"],

		["A r m u r e | 🏵️ ","Ils vous donnes toutes les armes de cette catégorie" +
		"\n", "ORANGE", "", "researchItem"],

		["C o m e s t i b l e s | 🏵️ ","Ils vous donnes toutes les armes de cette catégorie" +
		"\n", "ORANGE", "", "researchItem"]
	], ["⚔️", "🕸️" , "🦾", "🍖"]);
}

exports.help = {
    name: "item",
    description: "Visualiser son inventaire",
    usage: "=item",
    example: "=item"
}

exports.conf = {
    aliases: ["item", "items"]
}
