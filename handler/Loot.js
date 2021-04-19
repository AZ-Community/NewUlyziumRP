module.exports = client => {
		/*
		 *Gérer les loot
		 *
		 */	
	client.lootManagement = class {
		constructor(){				
			this.addingLoot = (args) => {
				return new Promise((resolve, reject) => {
					//On vérifie qu'on a au moins le monstre
					var nameMonster = "";
					for(var i = 0; i < args.length; i++) nameMonster = (i+1 == args.length) ? nameMonster += args[i] + " " : nameMonster +=  args[i];	
					client.con.query(`SELECT * FROM monsterLoot WHERE nameMonster='$'{nameMonster}'`, (err, rows) => {
						if(rows){
							resolve(client.sendEmbed(`:x:, Monstre déjà existant`, "", "RED"));	
						}else{
							client.con.query(`INSERT INTO monsterLoot(nameMonster, lootItems) VALUES ('${nameMonster}', '[]')`);
							resolve(client.sendEmbed(`:white_check_mark: - Ajout des loots basiques pour le monstre \`${nameMonster}\``, "", "GREEN"));	
						}
					})	
				});
			}
			//<Loot1;Probabilité;LootMin;LootMax>|<Loot2;etc...>|Monstre du Chaos...
			this.modifingLoot = (args) => {
				return new Promise((resolve, reject) => {
					var argsSeparate = args.split('|'); var allLoots = new Map(); 
					client.con.query(`SELECT * FROM monsterLoot WHERE nameMonster='${argsSeparate[args.length-1]}'`, async(err, rows) => {
						if (err && !rows) resolve(client.sendEmbed(`:x: Erreur `, `venant de la requête \`SELECT\` pour les loots \n ${err}!`, "RED"));
						//On regarde le nombre de loots
						for(var i =0; i < argsSeparate.length-1; i++){
							var prob = argsSeparate[i].split(";");
							//On regarde les probabilités
							if(prob.length < 3) resolve(client.sendEmbed(`:x: - Annulation - Respecter la syntaxe`,
							`<Loot1;Probabilité;LootMin;LootMax>|<Loot2;etc...>|Monstre du Chaos...`, "RED"));
							if(!client.itemInformation(prob[0])){
								resolve(client.sendEmbed(
									":x: `ERREUR` - Item inconnu",
									` votre item \`${prob[0]}\` n'existe pas`,
									"RED"
								));
							}
							allLoots.set(allLoots.size+1,client.createLoot(prob[0], prob[1], prob[2],prob[3]));							
						}
						var json = await client.changeMapToJson(allLoots, false);
						client.con.query(`UPDATE monsterLoot SET lootItems='[ ${json} ]' WHERE nameMonster='${argsSeparate[argsSeparate.length-1]}';`, (err) => {
							resolve(client.sendEmbed(`:white_check_mark: - Modification`, 
							`Les loots du monstre \`${argsSeparate[(argsSeparate.length-1)]}\` ont bien été modifié`, 
							"GREEN"));
						});
					});	
				});
			}
			//On supprime les loots du monstre intitulé
			this.removingLoot = (args) => {
				return new Promise((resolve, reject) => {
					var nameMonster; var argsSeparate = args.split('|'); 
					if(argsSeparate.length == 1){
						client.con.query(`SELECT * FROM monsterLoot WHERE nameMonster='${argsSeparate[0]}'`, async(err, rows) => {
							if (err && !rows) resolve(client.sendEmbed(`:x: Erreur `, `venant de la requête \`SELECT\` pour les loots \n ${err}!`, "RED"));	
								client.con.query(`DELETE FROM monsterLoot WHERE nameMonster='${argsSeparate[0]}'`, (err) => {
								if(err) resolve(client.sendEmbed(
										":x: ERREUR",
										"ERREUR: Lors de la requête `DELETE FROM`,\n " + err,
										"RED"));
								resolve(client.sendEmbed(`:white_check_mark: - Modification`, 
									`Les loots du monstre \`${argsSeparate[0]}\` ont bien été supprimés`, 
									"GREEN"));
							});
						});	
					}
				});
			}
		}
	}
	client.lootManager = client.lootManagement();	
	/*
	 * @param ItemID = String
	 * @param probability = int
	 * @lootMin = int
	 * @lootMax = int
	 * Créer un système de loot
	 */
	client.createLoot = (itemID, probability, lootMin, lootMax) => {
		return {item: itemID, prob:probability, qtmin: lootMin, qtmax: lootMax};
	};
}
