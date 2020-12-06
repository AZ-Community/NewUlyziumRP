const fs = require('fs');
const { resolve } = require('path');
module.exports = client => {
	/* Reload items from DB*/
	const items = new Map();
	client.loadItems = async () => {
		items.clear();
		client.con.query("SELECT * FROM itemLists", (err, rows) => {
			console.log('----------------------------------------------------------')
			console.log("Initialisation des items...");
			for(var i = 0; i < rows.length; i++){
				itemListType = JSON.parse(rows[i].items);
				if(Object.keys(itemListType).length <= 0) return;
				itemListType.forEach( item => {
					items.set(rows[i].type+"-"+item.id, item);
				});
			}
			console.log(items);
			console.log("----------------------------------------------------------");
		});
	}
	client.addInvDatabase = (obj, nameObj = undefined) =>{
		return new Promise((resolve, reject) => {
			if(!nameObj){
				client.con.query(`INSERT INTO itemLists(type, items) VALUES('${obj}', '{}')`, (err) => {
					if(err) reject(err);
					resolve(`Votre type ${obj} est crée`);
				});
			}else{
				client.con.query(`SELECT * FROM itemLists WHERE type = '${obj}'`, (err, rows) => {
					if(err) reject(err);
					if(rows.length <= 0) reject("Le type n'existe pas");
					const itemsLoad = JSON.parse(rows[0].items);
					items.set(rows[0].type+"-"+(items.size+1), JSON.parse(client.itemExample(items.size+1, nameObj)));
					if(itemsLoad.size > 0) client.loadItems();	
					//On envoie la requête
					mapToJson = client.changeMapToJson();
					client.con.query(`UPDATE itemLists SET items='${mapToJson}' WHERE type = '${obj}';`, (err) => {
						if(err) reject(err);
						client.loadItems();
						resolve(`Votre item **${nameObj}** a été inséré :white_check_mark:`);
					});
				});
			}
		});
	}
	//Modifier le nom du type
	client.modifyTypeDatabase = (type, newType) => {
		return new Promise((resolve, reject) => {
			client.con.query(`SELECT * FROM itemLists WHERE type='${type}';`, (err, rows) => {
				if(err) reject (err);
				console.log(rows)
				client.con.query(`UPDATE itemLists SET type ='${newType}' WHERE type='${rows[0].type}'`, (err) =>{
					if(err) reject (err);
					client.loadItems();
					resolve(`Le type ${type} a été renommé en ${rows[0].type}`);
				});
			});
		});
	}

	client.modifyInvDatabase = (type, idObj, param, paramValue) => {
		return new Promise((resolve, reject) => {
			items.forEach((value, key) => {
				if(Object(key).localeCompare(type+"-"+idObj) == 0) {
					switch(param){
						case "setDamage":
							if(isNaN(paramValue)){
								reject({embed: {"description": ":x: Il me faut un nombre entier", "color": "RED"}});
								return;
							}
							value.details.DAMAGE = paramValue;
							break;
						case "setProtection":
							if(isNaN(paramValue)){
								reject({embed: {"description": ":x: Il me faut un nombre entier", "color": "RED"}});
								return;
							}
							value.details.PROTECTION = paramValue;
							break;
						case "setCraftable":
							break;
						case "setDescription":
							break;
						default:
							reject({embed :{"description" : "Veuillez utiliser un paramètre à modifier! \n Plus d'information avec la commande =items"}});
							break;
					}
					//On met à jours nos changements
					mapToJson = client.changeMapToJson();
					console.log(mapToJson);
					client.con.query(`UPDATE itemLists SET items = '${mapToJson}' WHERE type = '${type}'`, (err) => { 	
						if(err) reject(err);
						client.loadItems();
					});
					resolve(":white_check_mark: La modification a bien été faite");	
				}
			});
			resolve({embed: {"description": `L'id suivant ${idObj} dans le type ${type} est inexistant`, "color": "RED"}});	
		});
	}

	client.removeTypeDatabase = (type) => {
	
	}
	
	client.removeInvDatabase = (type, idObj) => {

	}

	client.itemExample = (id, obj, value = {"damage": 0, "protection": 0, "craftable": false, "description": "Description initiale"})  => {
		return `{"id": ${id}, "name": "${obj}", "details": { "DAMAGE": ${value.damage} , "PROTECTION": ${value.protection}, 
		"CRAFTABLE": ${value.craftable}}, "craftable": {} , "description": "${value.description}"}`;
	}

	client.changeMapToJson = () => {
		var mapToJson = `[\n`;
		let sizeMap = 0;
		items.forEach( item => {
			mapToJson += (items.size == (sizeMap + 1)) ? client.itemExample(item.id, item.name, {"damage": (item.details.DAMAGE || 0), "protection": ( item.details.PROTECTION || 0),
										"craftable": ( item.details.CRAFTABLE || false)}) + 
			"\n" : client.itemExample(item.id, item.name, {"damage": (item.details.DAMAGE || 0), "protection": ( item.details.PROTECTION || 0)} ) + ", \n";
			sizeMap++;
		});
		mapToJson += `]`;
		return mapToJson;
	}
	
	/*
     * client.giveToPlayerItem -> Give Player item
     * @param {*} idPlayer - Player id.
     * @param {*} itemID - Item id.
     * @param {*} quantity - Quantity. (set to one by default) 
     */
    client.giveToPlayerItem = (idPlayer, itemID, quantity) => {
        return new Promise((resolve, reject) => {
			client.con.query(`SELECT * FROM inventory WHERE idplayer ='${idPlayer}' AND itemid ='${itemID}'`, (err, rows) => {
				if(err) reject(err);
				if(rows.length >= 1){
					if(quantity > 0){
						if(rows[0].quantity - quantity < 0){
							client.con.query(`DELETE FROM inventory WHERE idplayer= '${idPlayer}' AND itemid='${itemID}'`, (err) => {
								if(err) reject(err);	
							});
						}else{
							client.con.query(`UPDATE inventory SET quantity='${rows[0].quantity - quantity}' WHERE idplayer='${idPlayer}' AND itemid='${itemID}'`, (err) => {
								if(err) reject(err);
							});	
						}
					}else{
						client.con.query(`UPDATE inventory SET quantity='${rows[0].quantity + quantity}' WHERE idplayer='${idPlayer}' AND itemid='${itemID}'`, (err) => {
							if(err) reject(err);
						});		
					}
				}else{
					client.con.query(`INSERT INTO inventory (idplayer, itemid, quantity) VALUES ('${idPlayer}','${itemID}', '${Math.abs(quantity)}')`, (err) => {
						if(err) reject(err);
					});
				}
			});		
        });
    }
	/*
	 *client.isAValidItemID -> Return if it's a good item or not 
	 *@param {*} itemID - ItemID
	 *@param {*} nameOrID - Retourne le nom avec "name" ou l'id avec "id"
	 */
	client.itemInformation = (itemID, nameOrID) => {
		for(let[key, value] of items){
			if(itemID == key){
				if(nameOrID == "id"){
					return true;
				}else if(nameOrID == "name"){
					return value.name;
				}
			}
		}
		return false;
	}	
	client.returnInventory = (idPlayer) => {
		return new Promise((resolve, reject) => {
			var listMap = new Map();
        	client.con.query("SELECT * FROM inventory WHERE idplayer=" + idPlayer, (err, rows) => {
            	if(err) reject(err);
            	if(rows.length >= 1){
	            	for(let i = 0; i < rows.length; i++){  
						listMap.set(client.itemInformation(rows[i].itemid, "name"), rows[i].quantity);
					}
    	            resolve(listMap);					
            	}else resolve('Inventaire vide...');
  			});
		});
	}
	client.resetInventory = (idPlayer) => {
		return new Promise((reject) => {
			client.con.query(`DELETE FROM inventory WHERE idplayer=${idPlayer}`, (err) => {
				if(err) reject(err);
			});
		});
	}
}
