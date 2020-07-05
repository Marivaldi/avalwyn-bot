const how_to_play_embed = require("../embeds/how_to_play_embed");
module.exports = async (message) => {
    message.channel.send(how_to_play_embed)
}