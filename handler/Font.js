const Canvas = require("canvas");

module.exports = (client) => {
	client.canvas = Canvas;
	client.canvas.registerFont('./fonts/PixAntiqua.ttf', { family: 'PixAntiqua' })
	client.applyText = (canvas, text) => {
		const ctx = canvas.getContext('2d');
		let fontSize = 70;
		do {
			ctx.font = `${fontSize -= 10}px "PixAntiqua"`;
		} while ( ctx.measureText(text).width > 150 );
		return ctx.font;
	};
}
