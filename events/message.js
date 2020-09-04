const Discord = require('discord.js');

module.exports = async (client, message) => {
    if(message.author.bot || message.author === client.user) return;
    let prefix = client.config.prefix;

    if(message.content.startsWith(prefix)) {
        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let msg = message.content.toLowerCase();
        let cmd = args.shift().toLowerCase();
        let sender = message.author;

        message.flags = [];
        while(args[0] && args[0][0] === "-") {
            message.flags.push(args.shift().slice(1));
        }

        let commandFile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
        if(!commandFile) return;

        try {
            commandFile.run(client, message, args);
        } catch(err) {
            console.log(err.message);
        } finally {
            console.log(`[LOG] ${sender.tag} (${sender.id}) ran a command: ${cmd}`);
        }
    }
};