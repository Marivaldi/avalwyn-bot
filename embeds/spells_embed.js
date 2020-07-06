const faction_selection = require('../texts/faction_selection.json');
const Discord = require('discord.js');
const spells = require('../factions/spells.json');
const faction_text = require('../texts/faction_text.json');

const embed = new Discord.MessageEmbed()
.setColor("#690055")
.setTitle("Spells")
.setDescription("*Spells require a certain magic level in order to cast them.*");

const valid_spells = Object.keys(spells);
valid_spells.forEach((spell_key) => {
    const spell = spells[spell_key];
    const cast_on_self_text = (spell.can_cast_on_self) ? ":white_check_mark:" : ":no_entry_sign:"
    embed.addFields(
        { name: `${spell.name} (LVL ${spell.magic_level_requirement})`, value: `${spell.description}\nCan Cast on Self? ${cast_on_self_text}\n\`${process.env.PREFIX + spell.usage}\``}
    )
})

embed.setTimestamp()

module.exports = embed;