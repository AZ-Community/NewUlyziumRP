/**
 * -> Requires
 */
const Discord = require('discord.js');
const { config } = require('dotenv');
const UlyziumBot = require('./handler/ClientBuilder.js');

/**
 * -> Initialisation
 */
const client = new UlyziumBot({disableEveryone:true});

config({path:__dirname+'/.env'});

require('./handler/Database.js')(client);
require('./handler/Module.js')(client);
require('./handler/Event.js')(client);
require('./handler/Leveling.js')(client);

/**
 * Events Initialisation
 */
client.on('warn', console.warn);
client.on('error', console.error);

/**
 * -> Log bot
 */
client.login(process.env.TOKEN).catch(console.error);
