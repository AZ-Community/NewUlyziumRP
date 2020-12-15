const Discord = require('discord.js');
const { removeEmojis } = require('../funcs.js');

module.exports = async (client, message) => {
	client.filter = (reaction, user) => {
		return ['❌', '✅', '1️⃣', '2️⃣', '3️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
	};

    if(message.author.bot || message.author === client.user) return;
    let prefix = client.config.prefix;

    if(message.content.startsWith(prefix)) {
        let args = message.content.slice(prefix.length).trim().split(/ +/g);
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

        return;
    }

    let cooldownID = `msgXP.${message.author.id}`;

    if(client.cooldowns.has(cooldownID)) {
        let canXPAt = new Date(client.cooldowns.get(cooldownID));
        canXPAt = new Date(canXPAt.setMinutes(canXPAt.getMinutes()+client.config.cooldownXP));

        if(canXPAt <= message.createdAt){
            client.cooldowns.delete(cooldownID);
        }else{
            return;
        }
    }

    message.content = removeEmojis(message.content); // Stop players who want to farm XP with emojis.

    if(await client.channelIsXPBan(message.guild.id, message.channel.id)) {
        return; // Channel ban -> Don't give XP.
    }

    message.content = message.content.trim();

    if(message.content === '') {
        return; // Message empty -> Don't give XP.
    }

    let XPPerMsg = client.config.minXPPerMsg;
    XPPerMsg += Math.floor(message.content.length/client.config.gainXPEveryCharacters);
    
    if(await client.playerAddXP(message.author.id, XPPerMsg, false)) {
        return client.cooldowns.set(cooldownID, new Date()); // Add player cooldown XP.
    }
};
