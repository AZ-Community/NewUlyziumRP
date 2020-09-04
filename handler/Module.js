const Discord = require('discord.js');
const fs = require('fs');

module.exports = client => {
    client.commands = new Discord.Collection();
    client.aliases = new Discord.Collection();
    client.helps = new Discord.Collection();

    fs.readdir('./commands/', (err, categories) => {
        if(err) console.error(err);
        categories.forEach(category => {
            let moduleConf = require(`../commands/${category}/module.json`);
            moduleConf.path = `./commands/${category}`;
            moduleConf.cmds = [];
            if(!moduleConf) return;
            client.helps.set(category, moduleConf);

            fs.readdir(`./commands/${category}`, (err, files) => {
                if(err) console.error(err);
                console.log(`-----------------------------------------------------------\nMODULE NAME: ${category.toUpperCase()}`);
                files.forEach(file => {
                    if(!file.endsWith('.js')) return;
                    let content = require(`../commands/${category}/${file}`);
                    let cmdName = file.split(".")[0];

                    client.commands.set(content.help.name, content);
                    
                    content.conf.aliases.forEach(alias => {
                        client.aliases.set(alias, content.help.name);
                    });

                    client.helps.get(category).cmds.push(content.help.name);
                    console.log(`-> ${cmdName.toUpperCase()} - Command initialised.`);
                });
                console.log(`-----------------------------------------------------------`);
            });
        });
    });
}