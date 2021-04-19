const Discord = require("discord.js");

exports.run = async (client, message, args) => {
	
	await client.con.query(`SELECT * FROM player WHERE id=${message.author.id}`, async (err, rows) => {	
		
		var member = message.guild.members.cache.get(message.author.id); 
		const canvas = client.canvas.createCanvas(900, 1080);
		const ctx = canvas.getContext('2d');
		ctx.imageSmoothingEnabled = false; //Pour éviter un flou
		//Le fond écran
		//On ajoute la tête dégueulasse 
		const avatar = await client.canvas.loadImage(message.author.displayAvatarURL({ format: 'png' }));
		const cadre = await client.canvas.loadImage('./images/wallpaper/befunky_layer.png');
		//Le pseudo

		ctx.font = client.applyText(canvas, message.author.username);
		ctx.fillStyle = '#000';
		ctx.fillText((member.nickname || member.user.username), 50, 360);

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
