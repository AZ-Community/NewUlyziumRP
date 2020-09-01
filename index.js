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

/**
 * -> Events test
 */
client.on('ready', () => {
    console.log('ONLINE');
});

/**
 * -> Log bot
 */
client.login(process.env.TOKEN);