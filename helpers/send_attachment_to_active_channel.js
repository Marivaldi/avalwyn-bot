const AvalwynStorage = require('../AvalwynStorage');

module.exports = (message, attachment, client) => {
    const active_channel_store = new AvalwynStorage().active_channel_storage;
    if(!attachment) return;

    const channel_id = active_channel_store.get("active_channel_id");
    if (!channel_id) return;

    const activeChannel = client.channels.cache.get(channel_id);
    if (!activeChannel) return;

    activeChannel.send(message, attachment);
}