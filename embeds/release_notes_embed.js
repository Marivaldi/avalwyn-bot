const faction_selection = require('../texts/faction_selection.json');
const Discord = require('discord.js');
const release_notes_version = (process.env.HEROKU_RELEASE_VERSION) ? `(${process.env.HEROKU_RELEASE_VERSION})` : "";
const embed = new Discord.MessageEmbed()
    .setColor(faction_selection.color)
    .setTitle(`Release Notes ${release_notes_version}`)
    .setDescription("*Send More* :coffee:");


embed.addFields({
    name: ":whiteclaw: Commands Show Correct Prefix :whiteclaw:",
    value: 'Painstakingly went through and made sure that *most* of the commands you see show the `a!` prefix instead of just `!`.'
},
{
    name: ":mage: Sorted Spells by Level :mage:",
    value: 'Made sure that all the spells are listed in order by level. Go ahead. Run `a!spells` and see.'
})


embed.setTimestamp()

module.exports = embed;