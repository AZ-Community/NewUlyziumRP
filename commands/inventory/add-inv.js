const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    const idMember = message.author.id
    if(!client.userIsStaff(message.guild, message.author)) {
        return message.channel.send({embed: {color: "RED", description: `:x: <@${message.author.id}>, cette commande est réservée aux membres du staff.`}});
    }
	if(args[0] == null || args[1] == null) return message.channel.send(exports.help.example)
	if(client.users.cache.get(args[0])) return message.channel.send({embed: {color: "RED", description: `:x: <@${message.author.id}>, Il ne s'agit pas d'une mention!`}});
	if(client.itemInformation(args[1], "id")){
        message.channel.send({embed: {color: "ORANGE", title: "VALIDATION DE L'AJOUT DE L'INVENTAIRE", field: { name:"**INFORMATION**", value: "Si vous ne réagissez pas durant une minute, l'ajout de l'item est automatiquement annulé" }}}).then(cfrm => {
       
        cfrm.react("❌");
        cfrm.react("✅")
        
        client.on("messageReactionAdd", (reaction, user) => {
            if(reaction.emoji.name == "✅" && user.id == idMember){
                client.giveToPlayerItem(message.author.id, args[1],  (args[2] || 1));
		        return message.channel.send({embed: {color: "GREEN", description: `:white_check_mark: <@${message.author.id}>, L'item **${client.itemInformation(args[1], "name")}**  a bien été envoyé à l'utilisateur!`}});
            }else{ 
                if(user.id != client.user.id && user.id != idMember) message.channel.send("<@"+ user.id +">Tu ne peux pas me duper, hehe. :sunglasses:");
                
                }
            }) 
        }, 60000);
	}else return message.channel.send({embed: {color:"RED", description: `:x: <@${message.author.id}>, il s'agit d'un mauvais id pour cet item !`}}) 
}

exports.help = {
    name: "add-inv",
    description: "Permet de give des items",
    usage: "=add-inv",
    example: "=add-inv <joueur mention> <id de l'item> [quantité]"
}

exports.conf = {
    aliases: ["add-inventory"]
}
