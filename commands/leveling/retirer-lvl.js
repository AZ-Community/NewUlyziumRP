const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    if(!client.userIsStaff(message.guild, message.author)) {
        return message.channel.send({embed: {color: "RED", description: `:x: <@${message.author.id}>, cette commande est réservée aux membres du staff.`}});
    }

    const user = message.mentions.users.first(); // Check if there is a player mention
    if(!user) return message.channel.send({embed: {color: "RED", description: `:x: <@${message.author.id}>, vous devez mentionner un joueur!`}});
    
    const member = message.guild.members.cache.get(user.id); // Check if user is a guild member
    if(!member) return message.channel.send({embed: {color: "RED", description: `:x: <@${message.author.id}>, le joueur mentionné n'est pas un membre du serveur!`}});
    
    if(!isFinite(args[1]) || args[1] <= 0) return message.channel.send({embed: {color: "RED", description: `:x: <@${message.author.id}>, le montant d'xp renseigné est incorrect!`}});

    if(await client.playerLevelDown(member.id, parseInt(args[1]))) return message.channel.send({embed: {color: "GREEN", description: `:white_check_mark: <@${message.author.id}> a retiré ${args[1]} niveau(x) à <@${member.id}>!`}});
    else return message.channel.send({embed: {color: "RED", description: `:x: Une erreur est survenue, impossible de retirer des niveaux à ce joueur.`}});
}

exports.help = {
    name: "retirer-lvl",
    description: "Permet au staff de retirer une valeur spécifique de niveau à un joueur.",
    usage: "=retirer-lvl <tag joueur> <valeur>",
    example: "=retirer-lvl @Ben'#7874 3"
}

exports.conf = {
    aliases: ["rm-lvl", "rmlvl", "-lvl"]
}