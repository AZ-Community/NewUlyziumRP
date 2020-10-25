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

/**
 * -> Handlers Initialisation
 */
require('./handler/Dialog.js')(client);
require('./handler/Database.js')(client);
require('./handler/Module.js')(client);
require('./handler/Event.js')(client);
require('./handler/Leveling.js')(client);
require('./handler/Inventory.js')(client);

/**
 * Events Initialisation
 */
client.on('warn', console.warn);
client.on('error', console.error);

/**
 * -> Log bot
 */
//client.login("NTQ2Mjc0NTIwMjA2NjcxODcz.XGfjyg.dIuKMpihSVlr0Pw9UckH0ML3BfQ").catch(console.error);
client.login(process.env.TOKEN).catch(console.error);
