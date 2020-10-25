const Discord = require('discord.js')

exports.run = async(client, message, args) =>{

    var idMember = message.author.id;
    var embedTitle = { embed: {title: "•──────═════［ Quêtes - <:696785151010537522:> ］═════──────•"}};
    var embedPictures = {embed: { image:{url:"https://images-ext-1.discordapp.net/external/RdTx0wrj8uiqKUv0blQW_hwtShbr9y9rNfc8U_AY8nc/https/media.discordapp.net/attachments/743582758554566659/769330598455672837/Npc_zoom_3990006000_01.png?width=655&height=546" }}};
    var embedSeparator = {embed: { title: "•──────═════［  **  ］═════──────•"}};
    var embedAction = new Discord.MessageEmbed().setTitle("**ACTIONS**").setColor("PURPLE")    
    var embedResponse = "";
    var embedRewards = "" 
    var totalReaction = new Array();
    var progress = await client.loadProgress(message.author.id, "MAIRE");
    message.channel.send(embedTitle).then(message => {
        message.channel.send(embedPictures).then(message => {
            message.channel.send(embedSeparator).then(message => {    
                client.dialogsPnj.forEach(function(dialog, value){
                    for(var [key, dial] of Object.entries(dialog.dialogs)){
                        if(progress.pgrplayers == key){
                            embedAction.addField(key, dial.dialog_pnj); 
                            for(var [react, answ] of Object.entries(dial.answers)){
                                    embedAction.addField(react, answ, false)        
                                    totalReaction.push(react)
                                }
                            for (var [val, gain] of Object.entries(dial.rewards)){
                                embedRewards += ` => ${val} - ${gain} \n`; 
                                }
                            }
                            embedResponse += dial.dialog_pnj;
                        }
                    embedAction.addField("__Récompenses__", (embedRewards || "Aucune récompense")) ;          
                });
                message.channel.send(embedAction).then(message => {
                    for(var i = 0; i < totalReaction.length; i++ ){
                        console.log(totalReaction)
                        message.react(totalReaction[i])
                    }

                    client.on('messageReactionAdd',(reaction, user) => {
                        for(var i = 0; i < totalReaction.length; i++){
                            if(user.id == client.user.id) return;
                            if(user.id != idMember) 
                                return client.users.cache.get(user.id).send("<@"+ user.id + ">, "+
                                " Oh non non! vilain garçon ou vilaine fille ! >:v" +
                                " On ne dérange pas le dialogue d'un joeur :angry:")
                            if(reaction.emoji.name != totalReaction[0]){ 
                                message.channel.send({embed: { description: embedResponse }})
                                client.saveProgress(idMember, 1, 0, "MAIRE");
                                break;
                            }else{
                                break;
                            }
                        }
                    });
                });
            });
        });
    });
}


exports.help = {
    name: "maire",
    description: "Permet d'échanger avec le personnage.",
    usage: "=maire",
    example: "=maire"
}

exports.conf = {
    aliases: ["maire"]
}
