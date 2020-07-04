const Storage = require('node-storage');
const send_message_to_active_channel = require('../helpers/send_message_to_active_channel');
const bot_store = new Storage('./data/bot_data');

module.exports = async (message, client) => {

        await send_message_to_active_channel("I'm going down for maintenance... hopefully :grimacing:", client)
        client.destroy();
}