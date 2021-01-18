const { resolve } = require('path');

module.exports = client => {
	client.returnMoney = (playerID) => {
		return new Promise((resolve, reject) => {
			client.con.query(`SELECT * FROM player WHERE id = ${playerID}`, (err, rows) => {
				if(rows.length < 1) resolve('Aucune donnée');
				else resolve(`_**Z i u m's :gem:**_\n[ ${rows[0].ziums} ] \n**_P i è c e s :moneybag:_** \n\`Or\` ${rows[0].gold}\n\`Argent\` ${rows[0].argent}\n\`Cuivre\`${rows[0].bronze}`);
			});
		});
	}
}
