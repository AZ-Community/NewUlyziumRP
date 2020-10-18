const fs = require('fs');
module.exports = client => {	
	var itemsTemp = require('../json/armes/armes-item.json');
	const items = new Map();
	itemsTemp.forEach(item => {
		items.set(item.id, item);
	});
	
	client.itemsTemp = null;

	/*
     * client.giveToPlayerItem -> Give Player item
     * @param {*} idPlayer - Player id.
     * @param {*} itemID - Item id.
     * @param {*} quantity - Quantity. (set to one by default) 
     */
    client.giveToPlayerItem = (idPlayer, itemID, quantity) => {
        return new Promise((resolve, reject) => {
			client.con.query('SELECT * FROM inventory WHERE idplayer =' + idPlayer, (err, rows) => {
				if(rows[0].id != itemID){
					client.con.query(`INSERT INTO inventory (idplayer, itemid, quantity) VALUES ('${idPlayer}','${itemID}', '${quantity}')`, (err) => {
						if(err) reject(err);
					});
				} else{
					client.con.query(`UPDATE inventory SET quantity= ${rows.quantity + quantity} WHERE idplayer = ${idPlayer} AND itemid= ${itemID}`, (err) => {
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
	            	for(let i = 0; i < rows.length; i++) listMap.set(client.itemInformation(rows[i].itemid, "name"), rows[i].quantity);
    	            resolve(listMap);					
            	}else resolve('Inventaire vide...');
  			});
		});
	}
}
