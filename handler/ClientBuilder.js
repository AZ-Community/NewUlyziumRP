const { Client, Collection } = require('discord.js');

module.exports = class UlyziumBot extends Client {
    constructor(options) {
        super(options);
        this.commands = new Collection();
        this.aliases = new Collection();
        this.config = require('../config.json');
    }
}