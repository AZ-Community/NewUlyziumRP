const { resolve } = require('path');

module.exports = client => {
	/*
	 *	@param playerID = string
	 *	Change pieces to cuivre, argent , or
	 */
	client.returnMoney = (playerID) => {
		return new Promise((resolve, reject) => {
			client.con.query(`SELECT * FROM player WHERE id = ${playerID}`, (err, rows) => {
				if(rows.length < 1) resolve('Aucune donnée');
				else {
					var money = client.returnCoins(rows[0].pieces);
					resolve(`_**Z i u m's :gem:**_\n[ ${rows[0].ziums} ] \n**_P i è c e s :moneybag:_** \n\``+
					`Or\` ${money[0]}\n\`Argent\` ${money[1]} \n\`Cuivre\`${money[2]}`);
				}
			});
		});
	}
	/*
	 * @param id (player) = string 
	 * @param pieces = int
	 */
	client.changeMoney = (id, pieces) => {
		client.con.query(`SELECT * FROM player WHERE id='${id}'`, (err, rows) => {
			if(err) return err;
			console.log(rows);
			if(rows.length < 0) return "Aucun joueur trouvé";
			if(parseInt(rows[0].pieces) + pieces >= 0){
				client.con.query(`UPDATE player SET pieces='${parseInt(rows[0].pieces) + pieces}'  WHERE id = ${id}`, (err) => {
					if(err) return err;	
				});
			}else return "Vous n'avez pas assez d'argent, vous passerez en négatif.";
		});
	};
	/*
	 * @param pieces= int
	 * On modifie 2 pièces de cuvires en 1 pièce d'argent
	 * On modifie 5 pièces d'argent en 1 pièce d'or. (automatiquement)
	 */
	client.returnCoins = (pieces) => {
		pieces = parseInt(pieces);
		var or, argent, cuivre;
		argent = or = cuivre = 0;
		while(pieces != 0){
			if(pieces % 2 == 0){
				if((pieces/2)%5 == 0) {
					or += (pieces/2)/5;
					pieces = 0;
				}else{
					or += Math.trunc((pieces/2)/5);	
					pieces -= (or*2*5);
					argent += Math.trunc(pieces/2);
					pieces -= (argent*2);
				}
			}else{
				or += Math.trunc((pieces/2)/5);
				pieces -= (or*2*5);
				argent += Math.trunc(pieces/2);
				pieces -=  (argent*2);
				cuivre = pieces;
			}
			pieces = 0;
		}

		return [or, argent, cuivre];
	};
	/*
	 *	Canvas (soon);
	 */
	client.applyText = (canvas, text) => {
		const ctx = canvas.getContext('2d');
		let fontSize = 70;
		do {
			ctx.font = `${fontSize -= 10}px "PixAntiqua"`;
		} while ( ctx.measureText(text).width > 150 );
		return ctx.font;
	};
}
