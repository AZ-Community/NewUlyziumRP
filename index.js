/**
 * -> Requires
 */
const { Client } = require('discord.js');
const { config } = require('dotenv');

/**
 * -> Initialisation
 */
const client = new Client({disableEveryone:true});

config({path:__dirname+'/.env'});

client.prefix = process.env.PREFIX;

client.con = require("./db_config.js");

/**
 * -> Events test
 */
client.on('ready', () => {
    console.log('[ADVERT] Bot is online !');
});

/**
 * -> Log bot
 */
client.login(process.env.TOKEN);
