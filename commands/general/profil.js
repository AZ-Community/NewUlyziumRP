const Discord = require("discord.js");

exports.run = async (client, message, args) => {
	
	await client.con.query(`SELECT * FROM player WHERE id=${message.author.id}`, async (err, rows) => {	
		
		var member = message.guild.members.cache.get(message.author.id); 
		const canvas = client.canvas.createCanvas(487, 584);
		const ctx = canvas.getContext('2d');

		ctx.imageSmoothingEnabled = false;
		//Le fond écran
		const background = await client.canvas.loadImage('./images/wallpaper.png'); 
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		//On ajoute la tête dégueulasse 
		const avatar = await client.canvas.loadImage(message.author.displayAvatarURL({ format: 'png' }));
		ctx.drawImage(avatar, 15, 20, 200, 200);
		//Le cadre
		const cadre = await client.canvas.loadImage('./images/befunky_layer.png');
		ctx.drawImage(cadre, 10, 15, 215, 215);
		//Le pseudo

		ctx.font = client.applyText(canvas, message.author.username);
		ctx.fillStyle = '#ffffff';
		ctx.fillText(member.nickname, 50, 360);
		//Money
		ctx.font = '20px "PixAntiqua"'
		ctx.fillStyle= '#E68D03';
		ctx.fillText(rows[0].bronze, 350, 65);
		ctx.fillStyle= '#E6F3FA';
		ctx.fillText(rows[0].argent, 350, 110);
		ctx.fillStyle= '#E2C919';
		ctx.fillText(rows[0].gold, 350, 150);
		ctx.fillStyle= '#F6C1EF';
		ctx.fillText(rows[0].ziums, 350, 210);
		//Level
		ctx.fillStyle= '#F6C1EF';
		ctx.fillText(rows[0].level, 350, 320);
		//Stats

		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'profil.png');
		message.channel.send({embed: {files: [attachment], image: { url: 'attachment://profil.png'}}});
	});
	//on renvoit tout
}

exports.help = {
    name: "profil",
    description: "Visualiser son profim",
    usage: "=profil",
    example: "=profil"
}

exports.conf = {
    aliases: ["p"]
}
