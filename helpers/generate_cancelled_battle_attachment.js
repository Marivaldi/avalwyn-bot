const Discord = require('discord.js');
const Canvas = require('canvas');
const faction_images = require('../factions/faction_images.json');
const pickRandom = require('pick-random');

const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');

    // Declare a base size of the font
    let fontSize = 70;

    do {
        // Assign the font to the context and decrement it so it can be measured again
        ctx.font = `${fontSize -= 10}px Times New Roman`;
        // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (ctx.measureText(text).width > canvas.width - 300);

    // Return the result to use in the actual canvas
    return ctx.font;
};

module.exports = async (attacker_key, defender_key) => {
    const canvas = Canvas.createCanvas(800, 350);
    const ctx = canvas.getContext('2d');

    const attacker_images = faction_images[attacker_key];
    const defender_images = faction_images[defender_key];

    const attacker_image = pickRandom(attacker_images, {count: 1});
    const defender_image = pickRandom(defender_images, {count: 1});

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Slightly smaller text placed above the member's display name
    ctx.font = '28px Times New Roman';
    ctx.font = applyText(canvas, `Hello!`);
    ctx.fillStyle = '#8b0000';
    ctx.fillText(`X`, canvas.width / 2.2, canvas.height / 2);

    const attacker = await Canvas.loadImage(attacker_image[0]);
    ctx.drawImage(attacker, 25, 25, 250, 300);
    const defender = await Canvas.loadImage(defender_image[0]);
    ctx.drawImage(defender, 525, 25, 250, 300);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'battle-image.png')
    return attachment;
}