const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    let prefix = client.config.prefix;

    if(!args[0]) {
        let helps = client.helps.array();

        const embed = new Discord.MessageEmbed()
        .setColor(0x1d1d1d)
        .setTimestamp(new Date())
        .setDescription(`Pour plus d'informations, utilisez \`\`${prefix}aide [commande]\`\`.`)
        .setTitle('UlyziumBot')

        for(const help of helps) {
            embed.addField(`${help.name}`, help.cmds.map(cmd => `\`\`${cmd}\`\``).join(" | "));
        }

        embed.flat = null;

        return message.channel.send(embed);
    }else{
        let cmd = args[0];

        if(client.commands.has(cmd) || client.commands.has(client.aliases.get(cmd))) {
            let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
            let name = command.help.name, desc = command.help.description, aliases = command.conf.aliases.join(', ') ? command.conf.aliases.join(', ') : "Aucun alias renseigné.", usage = command.help.usage ? command.help.usage : 'Aucune utilisation renseignée.', example = command.help.example ? command.help.example : 'Aucun exemple renseigné.';

            const embed = new Discord.MessageEmbed()
            .setColor(0x7289DA)
            .setTitle(name)
            .setDescription(desc)
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter('[] optionel, <> requis. Veillez à ne pas les inclure lorsque vous saisissez la commande.')
            .addField('Alias', aliases, true)
            .addField('Utilisation', usage, true)
            .addField('Exemple', example, true);

            return message.channel.send(embed);
        }else{
            return message.channel.send({embed : {color: "RED", description: "Commande inconnue."}});
        }
    }
}

exports.help = {
    name: "aide",
    description: "Permet d'obtenir les informations d'une ou plusieurs commandes.",
    usage: "=aide",
    example: "=aide"
}

exports.conf = {
    aliases: ["help"]
}