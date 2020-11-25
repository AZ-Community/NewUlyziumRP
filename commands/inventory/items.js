const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    if(!client.userIsStaff(message.guild, message.author)) {
        return message.channel.send({embed: {color: "RED", description: `:x: <@${message.author.id}>, cette commande est réservée aux membres du staff.`}});
    }
    switch(args[0]){
        case "addType":
            message.channel.send(await client.addInvDatabase(args[1].toUpperCase()));
            break;
        case "modifyType":
            break;
        case "removeType":
            break;
        case "addItem":
            message.channel.send(await client.addInvDatabase(args[1].toUpperCase(), args[2]));
            break;
        case "modifyItem":
            break;
        case "removeItem":
            break;
        default:
            message.channel.send(exports.help.usage);
            break;
    }
}

exports.help = {
    name: "items",
    description: "Cette commande va permettre de gérer les items",
    usage: "=items [--add-type, --add-items, --modify-type, --modify-item, --remove-type, --remove-item]",
    example: "=items"
}

exports.conf = {
    aliases: ["item"]
}