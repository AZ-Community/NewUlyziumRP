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
			client.itemListInType("CC").then(value => {
				console.log(JSON.parse("[" +client.changeMapToJson(value)+ "]"));	
			});
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
			if(inMap) Json += `"${itemKey}": "${itemValue}"`; if(itemSize + 1 < Object.keys(obj).length) Json +=",";
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
								if(err) resolve(client.sendEmbed("[INSERT] Requête non valide", `${err}`, "RED"));	
								resolve(client.sendEmbed("Requête validée", "", "GREEN"));
							});
						});
					}else{
						var nameObj = "";
						for(var i =1; i < itemName.length; i++) nameObj += (itemName.length-1 == i) ? itemName[i]+ "" :  itemName[i]+" ";
						var inMyMap = (typeof client.itemListInType(typeName) == 'undefined') ? new Map()  : client.itemListInType(typeName).then((value) => {
							value.set(typeName+"-"+(Object.keys(value).length+1), client.createItem((Object.keys(value).length+1),nameObj));
							console.log(JSON.parse("["+client.changeMapToJson(value)+"]"));
						});
					}
				});
			}
			this.modifingObject = (typeSpecify) => {

			}
			this.removingObject = (typeName, itemName = undefined) => {

			}
		}
	}

	client.createItem = (idItem, itemName) => {
		return {id: idItem, name: `${itemName}`, details: {DAMAGE: 0, PROTECTION: 0, CRAFT: false }, craftable: {}, description: "Description basique" }
	}
}
