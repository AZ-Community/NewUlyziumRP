module.exports = client => {
	console.log('[ADVERT] Bot is online !');
	client.loadMarket();

	client.on('messageReactionAdd', async (reaction, user) => {
		if (reaction.partial) {
			try {

		console.log("Une réaction et d'une !!");
				await reaction.fetch();

			} catch (error) {
				console.error('Something went wrong when fetching the message: ', error);
				return;
			}
		}
	});
}
