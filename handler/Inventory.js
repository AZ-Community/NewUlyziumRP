const fs = require('fs');
module.exports = client => {
	/* Reload items from DB*/
	const items = new Map();
	client.loadItems = () => {
		items.clear();
		client.con.query("SELECT * FROM itemLists", (err, rows) => {
			for(var i = 0; i < rows.length; i++){
				itemListType = JSON.parse(rows[i].items);
				if(Object.keys(itemListType).length < 1) return;
				itemListType.forEach( item => {
					items.set(rows[i].type+"-"+item.id, item);
				});
				console.log(items);
			}
		});
	}
	client.addInvDatabase = (obj, nameObj) =>{
		const itemToAdd = new Map();
		return new Promise((resolve, reject) => {
			if(!nameObj){
				client.con.query(`INSERT INTO itemLists(type, items) VALUES('${obj}', '${JSON.stringify(itemToAdd)}')`, (err) => {
					if(err) reject(err);
					resolve(`Votre type ${obj} est crée`);
				});
			}else{
				client.con.query(`SELECT * FROM itemLists WHERE type = '${obj}'`, (err, rows) => {
					if(err) reject(err);
					if(rows.length <= 0) reject("Le type n'existe pas");
					const itemsLoad = JSON.parse(rows[0].items);
					if(Object.keys(itemsLoad).length > 0){
						itemsLoad.forEach(item => {
							itemToAdd.set(rows[0].type+"-"+item.id, item);
						});
					}
					itemToAdd.set(rows[0].type+"-"+itemToAdd.size+1, client.itemExample(itemToAdd.size+1, nameObj));
					//On transforme la map en string
					var mapToJson = `[\n`;
					var sizeMap = 0;
					itemToAdd.forEach( item => {
						sizeMap++;
						if(itemToAdd.size == sizeMap){
							mapToJson += ` { "id": ${item.id}, "name": "${item.name}" } \n`;
						}else{
							mapToJson += ` { "id": ${item.id}, "name": "${item.name}" }, \n`;
						}
					});
					mapToJson += `]`;
					//On envoie la requête
					client.con.query(`UPDATE itemLists SET items='${mapToJson}' WHERE type = '${obj}';`, (err) => {
						if(err) reject(err);
						resolve(`Votre item **${nameObj}** a été inséré :white_check_mark:`);
					});
				});
			}
		});
	}
	client.modifyInvDatabase = (obj, idObj) => {

	}
	client.removeInvDatabase = (obj, idObj) => {

	}

	client.itemExample = (id, obj) => {
		return {"id": id, "name": obj};
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
