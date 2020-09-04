const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    message.channel.send("✅");
}

exports.help = {
    name: "test",
    description: "First test system",
    usage: "=test",
    example: "=test"
}

exports.conf = {
    aliases: ["t"]
}