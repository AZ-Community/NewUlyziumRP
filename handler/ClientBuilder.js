const { Client, Collection } = require('discord.js');

module.exports = class UlyziumBot extends Client {
    constructor(options) {
        super(options);
        this.commands = new Collection();
        this.aliases = new Collection();
        this.config = require('../config.json');
        this.cooldowns = new Collection();

        this.userIsStaff = (guild, author) => {
            return guild.member(author).hasPermission('KICK_MEMBERS');
        }
    }
}