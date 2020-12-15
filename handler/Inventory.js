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
}
