const Storage = require('node-storage');
const active_channel_store = new Storage('./data/active_channel_data');

module.exports = (message, client) => {
    if(!message) return;

    const channel_id = active_channel_store.get("active_channel_id");
    if (!channel_id) return;

    const activeChannel = client.channels.cache.get(channel_id);
    if (!activeChannel) return;

    activeChannel.send(message);
}