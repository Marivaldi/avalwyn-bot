const spells_embed = require("../embeds/spells_embed");
module.exports = async (message) => {
    message.channel.send(spells_embed)
}