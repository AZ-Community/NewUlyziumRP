const fs = require('fs');
module.exports = client => {
	const items = new Map();
	items.set(0, "Test name")
      /**
     * client.giveToPlayerItem -> Give Player item
     * @param {*} idPlayer - Player id.
     * @param {*} itemID - Item id.
     * @param {*} quantity - Quantity. (set to one by default) 
     */
    client.giveToPlayerItem = (idPlayer, itemID, quantity) => {
        return new Promise((resolve, reject) => {
            client.con.query(`INSERT INTO inventory (idplayer, itemid, quantity) VALUES (${idPlayer},${itemID}, ${quantity})`);
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
					return true
				}else if(nameOrID == "name"){
					return value;
				}
			}
		}
		return false
	}	
}
