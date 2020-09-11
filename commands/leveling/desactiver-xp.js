const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    if(!client.userIsStaff(message.guild, message.author)) {
        return message.channel.send({embed: {color: "RED", description: `:x: <@${message.author.id}>, cette commande est réservée aux membres du staff.`}});;
    }

    if(!await client.banXPChannel(message.guild.id, message.channel.id)){
        return message.channel.send({embed: {color: "RED", description: `:x: <@${message.author.id}>, le gain d'XP est déjà désactivé dans ce salon.`}});
    }else{
        return message.channel.send({embed: {color: "GREEN", description: `:white_check_mark: <@${message.author.id}> a désactivé le gain d'XP dans ce salon.`}});
    }
}

exports.help = {
    name: "desactiver-xp",
    description: "Permet au staff d'empêcher les joueurs d'obtenir de l'XP dans le salon textuel concerné.",
    usage: "=desactiver-xp",
    example: "=desactiver-xp"
}

exports.conf = {
    aliases: ["ban-xp"]
}