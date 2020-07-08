const faction_selection = require('../texts/faction_selection.json');
const Discord = require('discord.js');
const release_notes_version = (process.env.HEROKU_RELEASE_VERSION) ? `(${process.env.HEROKU_RELEASE_VERSION})` : "";
const embed = new Discord.MessageEmbed()
    .setColor(faction_selection.color)
    .setTitle(`Release Notes ${release_notes_version}`)
    .setDescription("*You can now see Allrender in all his glory*");


embed.addFields({
    name: ":lizard: Krackan's Profile Pic :lizard:",
    value: `The picture for Krackan will now be Allrenders character image from our old Dracalli game.`
})


embed.setTimestamp()

module.exports = embed;