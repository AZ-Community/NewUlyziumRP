module.exports = async (client, reaction, user) => {
	//On vérifie si c'est un marché/
	client.con.query(`SELECT * FROM marketChannel WHERE idChannel ='${reaction.message.channel.id}';`, (err, rows) => {
		if(rows[0] && !user.bot){
			let myMap;
			for(const [k, v] of Object.entries(JSON.parse(rows[0].itemsMarket))){
				if (reaction.emoji.name == v.emote)  myMap = v;
			}
			if(!myMap) return;
			user.send(client.sendEmbed(
				"Confirmation de l'achat",
				"-> Êtes-vous sûr de votre choix ?",
				"ORANGE"
			)).then(message => {
				message.react("✅");
				message.react("❌");
				client.con.query(`INSERT INTO confirm(idPlayer, action) VALUES ('${user.id}', 'confirmMarket|${JSON.stringify(myMap)}');`)
			});
		}
	});

	//On regarde si c'est une confirmation par MP
	client.con.query(`SELECT * FROM confirm WHERE idPlayer='${user.id}';`, (err, rows) => {	
		if(user.bot) return;
		if(!rows[0]) return;
		var args = rows[0].action.split('|');
		switch(args[0].toLowerCase()){
			case "confirmmarket":
					item = client.itemInformation(JSON.parse(args[1]).id);
					if(reaction.emoji.name == "✅"){
						if(client.changeMoney(user.id, parseInt(JSON.parse(args[1]).price *-1)) != null)
							return user.send(client.sendEmbed(
								"",
								"Vous n'avez pas assez d'argent... Désolé.",
								"RED"
							));
						else{
							client.itemManage.giveToPlayerItem(user.id, JSON.parse(args[1]).id, JSON.parse(args[1]).qte);
							user.send(client.sendEmbed(
								"",
								"Vous avez bien acheté l'objet `"+ item.name +"` ! :smile:",
								"RED"
							));
						}
					}else user.send(client.sendEmbed(
						"",
						"Vous avez bien annulé votre achat `" + item.name + "`:smile: !",
						"RED"
					));
				break;
			case "confirmJoin":
				break;
		}
		client.con.query(`DELETE FROM confirm WHERE idPlayer='${user.id}'`, (err)=> {
			if(err) console.log(err);
		});
	});
};
