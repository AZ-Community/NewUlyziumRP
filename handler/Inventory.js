const { resolve } = require('path');

module.exports = client => {
	/* Reload items from DB*/
	const items = new Map();
	client.loadItems = async () => {
		items.clear();
		client.con.query("SELECT * FROM itemLists", async (err, rows) => {
			for(var i = 0; i < rows.length; i++){
				itemsInType = new Map(); //La liste des items rangés dans sa classe.
				itemListType = JSON.parse(rows[i].items); 
				if(Object.keys(itemListType).length > 0){
					itemListType.forEach( item => {
						itemsInType.set(rows[i].type+"-"+item.id, item);
					});
				}
				items.set(rows[i].type, itemsInType);
			}
			itemsInType = undefined;	
		});
	}
	/*
	 *TRANSFORMER NOTRE SYSTEME EN JSON
	 */

	client.changeMapToJson = (map, inMapOfMap = false) => {
		let itemSize = 0; let inItemSize = 0;let Json = "{"; //Initialize var
		let obj = (!inMapOfMap) ? Array.from(map).reduce((obj, [key, value]) => ( Object.assign(obj, { [key]: value }) ), {}) : map;		
		for(const [itemKey, itemValue] of Object.entries(obj)){ 
			inItemSize = 0;
			for(const [key, value] of Object.entries(itemValue)){
				if(typeof value === 'object'){ // Si l'objet comprend aussi un dictionnaire
					Json += `"${key}": ${client.changeMapToJson(value, true)}`
				}else{
					console.log(Object.entries(itemValue));
					if(Object.keys(itemValue).indexOf(key) != -1) Json += `"${key}": "${value}"`;	
				}
				if(inItemSize + 1 < Object.keys(itemValue).length) Json +=",";inItemSize++;
			}
			if(inMapOfMap){
				Json += `"${itemKey}":${itemValue}`; 
				//Si des clés existent
				if(itemSize + 1 < Object.keys(obj).length){
					Json +=","; 
					itemSize++; 
				}
			//Si d'autres items sont dans la liste
			}else if(itemSize + 1 < Object.keys(obj).length){ 
				Json +="},{"; itemSize++; 
			}
		}
		Json+= "}"
		return Json;
	}	
	/* @param typeSpecify = String,
	 	 function to give items of a type;*/
	client.itemListInType = (typeSpecify) => {
		return new Promise((resolve, reject) => { items.forEach((value, key) => { if(key.localeCompare(typeSpecify) == 0) resolve(value)})});
	}
	
	/*Constructor 
	 *Management of Items
	 * */
	client.itemsManagement = class {
		constructor(){

			/*
			 *Ajout d'un type ou d'un item dans l'objet
			 */
			this.addingObject = (typeName, itemName = undefined) => {
				return new Promise((resolve, reject) => {	
					if(!itemName){
						client.con.query(`SELECT * FROM itemLists WHERE type = '${typeName}'`, (err, rows) => {
							if(err) resolve(client.sendEmbed("Requête non valide", `${err}`, "RED"));
							if(rows.length >= 1) resolve(client.sendEmbed("Type déjà crée :warning:", "", "YELLOW"));
							client.con.query(`INSERT INTO itemLists(type, items) VALUES ("${typeName}", '{}');`, (err) => {
								if(err) resolve(client.sendEmbed(":x: [INSERT] Requête non valide", `${err}`, "RED"));	
								client.loadItems();
								resolve(client.sendEmbed("Requête validée", "", "GREEN"));
							});
						});
					}else{
						var nameObj = "";
						for(var i =1; i < itemName.length; i++) nameObj += (itemName.length-1 == i) ? itemName[i] :  itemName[i]+" ";
						var inMyMap = (typeof client.itemListInType(typeName) == 'undefined') ? new Map()  : client.itemListInType(typeName).then((value) => {
							value.set(typeName+"-"+(value.size+1), client.createItem(value.size+1,nameObj));
							console.log(client.changeMapToJson(value));
							client.con.query(`UPDATE itemLists SET items = '[${client.changeMapToJson(value)}]' WHERE type= '${typeName}'`, async (err) => {
								if(err) resolve(client.sendEmbed("[UPDATE] Requête invalide.", `${err}`, "RED"));
								client.loadItems();
								resolve(client.sendEmbed("Requête validée", "", "GREEN"));
							});
						});
					}
				});
			}
			this.updatingObject = () => {
				return new Promise((resolve, reject) => {
					for(const [classKey,classValue] of items){
						console.log(classKey);
					}
				});
			};
			this.modifingObject = (args) => {
				return new Promise((resolve, reject)  => {
					client.itemListInType(args[0].toUpperCase()).then((value) => {
						for(const [itemKey, itemValue] of value){
							if(Object(itemKey).localeCompare(args[1].toUpperCase()) == 0){ 
								switch(args[2].toUpperCase()){
									case "SETPROTECTION":
										if(!Number.isNaN(Number.parseInt(args[3]))) itemValue.details.PROTECTION = Number.parseInt(args[3]);
										break;
									case "SETDAMAGE":
										if(!Number.isNaN(Number.parseInt(args[3]))) itemValue.details.DAMAGE = Number.parseInt(args[3]);
										break;
									case "SETDESCRIPTION":
										var newDesc;
										for(var i=3; i < args.length; i++) newDesc += (i == args.length) ? args[i] : args[i] + " ";
										itemValue.description = newDesc;	
										break;
									case "SETCRAFTABLE":
										const craftMap = new Map();
										for(var i=3; i < args.length; i++) {
											if(args[i] != "|" && client.itemInformation(args[i])){
												if(!isNaN(parseInt(args[i+1]))) craftMap.set(args[i], parseInt(args[i+1]));
											}
										}
										console.log(craftMap);
										itemValue.details.CRAFT = true;
										let obj = Array.from(craftMap).reduce((obj, [key,value]) => (
											Object.assign(obj, {[key]: value})
										),{});
										itemValue.craftable = obj;
										break;
									default:
										resolve(client.sendEmbed("[Les arguments disponibles]", 
										"setProtection\nsetDamage\nsetDescription\nsetCraftable", "RED"));
										break;
								}
								const newMap =client.changeMapToJson(value);
								console.log(newMap);
								client.con.query(`UPDATE itemLists SET items= '[ ${newMap} ]' WHERE type = '${args[0]}'`, (err) => {
									if(err) resolve(client.sendEmbed("[ERREUR]", `${err}`));
								});
								resolve(client.sendEmbed(":white_check_mark: - Modification effectuée avec succès", "", "GREEN"));
							}
						}
						resolve(client.sendEmbed("[Item] Votre item est inexistant", "", "RED"));
					}).catch(err => {  resolve(client.sendEmbed("Erreur", `${err}`, "RED")) });
				});
			}
			this.removingObject =(typeName, itemName = undefined) => {
				return new Promise((resolve, reject) => {
					if(!itemName){
						client.con.query(`DELETE FROM itemLists WHERE type='${typeName}'`, (err) => {
							if(err) resolve(client.sendEmbed(":x: - Erreur ", `${err}`, "RED"));
							client.loadItems();
							resolve(client.sendEmbed(":white_check_mark: - Suppression  effectuée avec succès", "","GREEN"));
						});
					}else{
						const myMap = new Map();
						client.itemListInType(typeName).then(async value => {
							for(const [itemKey, itemValue] of Object.entries(value)){
								if(Object(itemKey).localeCompare(itemName) == 1) myMap.set(itemKey, itemValue);
							}
							var newMap = await client.changeMapToJson(myMap);
							newMap = (newMap == "{}") ? newMap = "{}" : newMap = `[ ${newMap} ]`;
							await client.con.query(`UPDATE itemLists SET items= '${newMap}' WHERE type = '${typeName}'`, (err) => {
								if(err) resolve(client.sendEmbed("[ERREUR]", `${err}`, 'RED'));
								client.loadItems();
								resolve(client.sendEmbed(":white_check_mark: - Suppresion  effectuée avec succès", "", "GREEN"));
							});
						});
					}
				});
			}
			this.giveToPlayerItem = (idPlayer, itemID, quantity) => {
				return new Promise((resolve, reject) => {
					client.con.query(`SELECT * FROM inventory WHERE idplayer ='${idPlayer}' AND itemid ='${itemID}'`, (err, rows) => {
						if(err) reject(err);
						if(rows.length >= 1){
							if(parseInt(rows[0].quantity) + quantity == 0){
								client.con.query(`DELETE FROM inventory WHERE idplayer= '${idPlayer}' AND itemid='${itemID}'`, (err) => { if(err) reject(err)});
							}else{
								if(quantity > 0){
									client.con.query(`UPDATE inventory SET quantity='${parseInt(rows[0].quantity) + parseInt(quantity)}' 
									WHERE idplayer='${idPlayer}' AND itemid='${itemID}'`, (err) => {if(err) reject(err)});		
								}else{
									client.con.query(`UPDATE inventory SET quantity='${(rows[0].quantity - quantity)}' 
									WHERE idplayer='${idPlayer}' AND itemid='${itemID}'`, (err) => { if(err) reject(err)})}	
							}
						}else{
							client.con.query(`INSERT INTO inventory (idplayer, itemid, quantity) 
							VALUES ('${idPlayer}','${itemID}', '${Math.abs(quantity)}')`, (err) => {			
								if(err) reject(err);
							});
						}
					});		
      	});				
    	}
			//Reset l'ivnentaire d'un joueur
			this.resetInventory = (idPlayer) => {
				return new Promise((reject) => {
					client.con.query(`DELETE FROM inventory WHERE idplayer=${idPlayer}`, (err) => {
						if(err) reject(err);
					});
				});
			}	
		}
	}
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
					var argsSeparate = args.split('|'); var allLoots = []; var itemName = "";	

					client.con.query(`SELECT * FROM monsterLoot WHERE nameMonster='${argsSeparate[args.length-1]}'`, async(err, rows) => {
						if (err && !rows) resolve(client.sendEmbed(`:x: Erreur `, `venant de la requête \`SELECT\` pour les loots \n ${err}!`, "RED"));
						//On regarde le nombre de loots
						for(var i =0; i < argsSeparate.length-1; i++){
							var prob = argsSeparate[i].split(";");
							//On regarde les probabilités
							if(prob.length < 3) resolve(client.sendEmbed(`:x: - Annulation - Respecter la syntaxe`,
							`<Loot1;Probabilité;LootMin;LootMax>|<Loot2;etc...>|Monstre du Chaos...`, "RED"));
							allLoots.push(client.createLoot(argsSeparate[argsSeparate.length-1], prob[1], prob[2], prob[3]));
						}
						var json = await client.changeMapToJson(allLoots, true);
						resolve(client.sendEmbed(`:white_check_mark: - Modification`, `Les loots du monstre \`${argsSeparate[(argsSeparate.length-1)]}\``, "GREEN"));
					});	
				});
			}
			this.removingLoot = (args) => {

			}
		}
	}
	client.itemInformation = (itemID) => {
		for(const [key, value] of items){
			for(const [itemKey, itemValue] of value) if(Object(itemKey).localeCompare(itemID) == 0) return itemValue.name;
		}
	}	
	client.createLoot = (itemID, prob, lootMin, lootMax) => {
		return {'item': itemID, 'prob':prob, 'qtmin': lootMin, 'qtmax': lootMax};
	}
	client.createItem = (idItem, itemName) => {
		return {id: idItem, name: `${itemName}`, details: {DAMAGE: 0, PROTECTION: 0, CRAFT: false }, craftable: {}, description: "Description basique"}
	}
}
