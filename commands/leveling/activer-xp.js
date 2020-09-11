const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    if(!client.userIsStaff(message.guild, message.author)) {
        return message.channel.send({embed: {color: "RED", description: `:x: <@${message.author.id}>, cette commande est réservée aux membres du staff.`}});;
    }

    if(!await client.unbanXPChannel(message.guild.id, message.channel.id)){
        return message.channel.send({embed: {color: "RED", description: `:x: <@${message.author.id}>, le gain d'XP est déjà activé dans ce salon.`}});
    }else{
        return message.channel.send({embed: {color: "GREEN", description: `:white_check_mark: <@${message.author.id}> a réactivé le gain d'XP dans ce salon.`}});
    }
}

exports.help = {
    name: "activer-xp",
    description: "Permet au staff de réautoriser les joueurs à obtenir de l'XP dans le salon textuel concerné.",
    usage: "=activer-xp",
    example: "=activer-xp"
}

exports.conf = {
    aliases: ["unban-xp"]
}