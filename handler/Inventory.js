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
	/* @param typeSpecify = String,
	 	 function to give items of a type;*/
	client.itemListInType = (typeSpecify) => {
		return new Promise((resolve, reject) => { items.forEach((value, key) => { if(key.localeCompare(typeSpecify) == 0) resolve(value)})});
	}
	
	/* @param typeSpecify = String
	 * @param manyMap = boolean
	 * Convert Map to Json. Finally to send in DB*/
	client.changeMapToJson = (map, inMap = false) => {
		let itemSize = 0; let inItemSize = 0;let Json = ""; //Initialize var
		let obj = (!inMap) ? Array.from(map).reduce((obj, [key, value]) => ( Object.assign(obj, { [key]: value }) ), {}) : map;		
		for(const [itemKey, itemValue] of Object.entries(obj)){ 
			if(!inMap) Json += "\n{";
			inItemSize = 0;
			for(const [key, value] of Object.entries(itemValue)){
				if(typeof value === 'object') Json+= `\n"${key}":{${client.changeMapToJson(value, true)}}`;
				else Json+= `\n"${key}": "${value}"`;
				if((inItemSize +1) < Object.keys(itemValue).length ) Json += ","; inItemSize++;
			}
			if(!inMap) Json += "}"
			if(inMap) Json += `"${itemKey}": ${itemValue}`; if(itemSize + 1 < Object.keys(obj).length) Json +=",";
			itemSize++;
		}
		return Json;
	}
	/*Constructor 
	 *Management of Items
	 * */
	client.itemsManagement = class {
		constructor(){
			this.addingObject = (typeName, itemName = undefined) => {
				return new Promise((resolve, reject) => {	
					if(!itemName){
						client.con.query(`SELECT * FROM itemLists WHERE type = '${typeName}'`, (err, rows) => {
							if(err) resolve(client.sendEmbed("Requête non valide", `${err}`, "RED"));
							if(rows.length >= 1) resolve(client.sendEmbed("Type déjà crée :warning:", "", "YELLOW"));
							client.con.query(`INSERT INTO itemLists(type, items) VALUES ("${typeName}", '{}');`, (err) => {
								if(err) resolve(client.sendEmbed(":x: [INSERT] Requête non valide", `${err}`, "RED"));	
								resolve(client.sendEmbed("Requête validée", "", "GREEN"));
							});
						});
					}else{
						var nameObj = "";
						for(var i =1; i < itemName.length; i++) nameObj += (itemName.length-1 == i) ? itemName[i] :  itemName[i]+" ";
						var inMyMap = (typeof client.itemListInType(typeName) == 'undefined') ? new Map()  : client.itemListInType(typeName).then((value) => {
							value.set(typeName+"-"+(value.size+1), client.createItem(value.size+1,nameObj));
							console.log(client.changeMapToJson(value));
							client.con.query(`UPDATE itemLists SET items = '[${client.changeMapToJson(value)}]' WHERE type= '${typeName}'`, (err) => {
								if(err) resolve(client.sendEmbed("[UPDATE] Requête invalide.", `${err}`, "RED"));
								resolve(client.sendEmbed("Requête validée", "", "GREEN"));
							})
						});
					}
				});
			}
			this.modifingObject = (args) => {
				return new Promise((resolve, reject)  => {
					client.itemListInType(args[0].toUpperCase()).then(async (value) => {
						for(const [itemKey, itemValue] of value){
							if(Object(itemKey).localeCompare(args[1].toUpperCase()) == 0){ 
								switch(args[2].toUpperCase()){
									case "SETPROTECTION":
									case "SETDAMAGE":
										if(!Number.isNaN(Number.parseInt(args[3]))){
											if(args[2] == "SETPROTECTION") itemValue.details.PROTECTION = args[3];
											else itemValue.details.DAMAGE = args[3];
										}
										break;
									case "SETDESCRIPTION":
										var newDesc;
										for(var i=3; i < args.length; i++) newDesc += (i == args.length) ? args[i] : args[i] + " ";
										itemValue.description = newDesc;	
										break;
									case "SETCRAFTABLE":
										const craftMap = new Map();
										for(var i=3; i < args.length; i++) {
											if(args[i] != "|" && client.itemInformation(args[i], "id")){
												if(!isNaN(parseInt(args[i+1]))) craftMap.set(args[i], parseInt(args[i+1]));
											}
										}
										itemValue.details.CRAFTABLE = true;
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
								const newMap = await client.changeMapToJson(value);
								await client.con.query(`UPDATE itemLists SET items= '[ ${newMap} ]' WHERE type = '${args[0]}'`, (err) => {
									if(err) resolve(client.sendEmbed("[ERREUR]", `${err}`));
								});
								resolve(client.sendEmbed(":white_check_mark: - Modification effectuée avec succès", "", "GREEN"));
							}
						}
						resolve(client.sendEmbed("[Item] Votre item est inexistant", "", "RED"));
					}).catch(err => {  resolve(client.sendEmbed("Erreur", `${err}`, "RED")) });
				});
			}
			this.removingObject = (typeName, itemName = undefined) => {
				if(!itemName){
					client.con.query(`DELETE FROM itemLists WHERE type='${typeName}'`, (err) => {
						if(err) return err;
					});
				}else{
					const myMap = new Map();
					client.itemListInType(typeName).then(value => {
						for(const [itemKey, itemValue] of Object.entries(value)){
							if(Object(itemKey).localeCompare(itemName) == 1) myMap.set(itemKey, itemValue);
						}	
					});
				}
			}
			this.giveToPlayerItem = (idPlayer, itemID, quantity) => {
				return new Promise((resolve, reject) => {
					client.con.query(`SELECT * FROM inventory WHERE idplayer ='${idPlayer}' AND itemid ='${itemID}'`, (err, rows) => {
						if(err) reject(err);
						if(rows.length >= 1){
							if(rows[0].quantity + quantity == 0){
								client.con.query(`DELETE FROM inventory WHERE idplayer= '${idPlayer}' AND itemid='${itemID}'`, (err) => { if(err) reject(err)});
							}else{
								if(quantity > 0){
									client.con.query(`UPDATE inventory SET quantity='${(rows[0].quantity + quantity)}' 
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
			this.resetInventory = (idPlayer) => {
				return new Promise((reject) => {
					client.con.query(`DELETE FROM inventory WHERE idplayer=${idPlayer}`, (err) => {
						if(err) reject(err);
					});
				});
			}	
		}
	}
	client.itemInformation = (itemID) => {
		for(const [key, value] of items){
			for(const [itemKey, itemValue] of value){
				if(Object(itemKey).localeCompare(itemID) == 0) return itemValue.name;
			}
		}
	}	

	client.createItem = (idItem, itemName) => {
		return {id: idItem, name: `${itemName}`, details: {DAMAGE: 0, PROTECTION: 0, CRAFT: false }, craftable: {}, description: "Description basique" }
	}
}
