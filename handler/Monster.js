const {resolve} = require('path');

module.exports = client => {	
	client.monsterManagement = class {
		constructor(){
			/*
			 * @param args = List<String> 
			 * Addding Monster in dB
			 */
			this.addMonster = (args) => {
				return new Promise((resolve, reject)  => {
					const monsterInfo = args.split('|');
					if(monsterInfo.size < 3) resolve(client.sendEmbed(
						":x: [ Respecte la construction ] ",
						"",
						"RED"
					));
					client.con.query(`SELECT * FROM monsters WHERE name = '${monsterInfo[0]}' `, (err, rows) => {
						if (err) reject(err);
						if (rows.length == 0){
							client.con.query(`INSERT INTO monsters(name, pntAtk, pntLife, loots , catchSentence) VALUES ('${monsterInfo[0]}', '${monsterInfo[1]}', '${monsterInfo[2]}', '{}', '${monsterInfo[3]}')`, (err) => {
								if(err) reject (err);
								resolve(client.sendEmbed(
									`:white_check_mark: Monstre\`${monsterInfo[0]}\` Crée`,
									"",
									"GREEN"
								));
							});
						}else resolve(client.sendEmbed(
							":x: Monstre déjà crée",
							"",
							"RED"
						));
					});
				});		
			}
			/*
			 * @param args = List<String>
			 * Modif map constructor of a Monster.
			 */
			this.modifMonster = (args) => {
			
			}
			/*
			 * @param args = List<String>
			 * Delete a monster in DB
			 */
			this.removeMonster = () => {

			}
			this.modifingLoot = (args) => {
				return new Promise((resolve, reject) => {
					const  argsSeparate = args.split('|'); 
					const allLoots = new Map(); 
					client.con.query(`SELECT * FROM monsters WHERE nameMonster='${argsSeparate[args.length-1]}'`, async(err, rows) => {
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
						const json = await client.changeMapToJson(allLoots, false);
						client.con.query(`UPDATE monsters SET loots='[ ${json} ]' WHERE nameMonster='${argsSeparate[argsSeparate.length-1]}';`, (err) => {
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
						client.con.query(`SELECT * FROM monsters WHERE nameMonster='${argsSeparate[0]}'`, async(err, rows) => {
							if (err && !rows) resolve(client.sendEmbed(`:x: Erreur `, `venant de la requête \`SELECT\` pour les loots \n ${err}!`, "RED"));	
								client.con.query(`UPDATE monsters SET loots ='{}' WHERE nameMonster='${argsSeparate[0]}'`, (err) => {
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
	
	client.monsterManager = new client.monsterManagement();
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
