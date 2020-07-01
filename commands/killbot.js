const Storage = require('node-storage');
const bot_store = new Storage('./data/bot_data');

module.exports = (client) => {
    const players = bot_store.get("players") || [];
}

function destroy (client) { client.destroy() }