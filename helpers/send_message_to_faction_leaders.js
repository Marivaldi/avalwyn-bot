const AvalwynStorage = require('../AvalwynStorage');

module.exports = (message, faction_key, client) => {
    const faction_store = new AvalwynStorage().faction_storage;
    const faction = faction_store.get(faction_key);
    if(!faction) return;

    faction.leaders.forEach(leader => {
        const user = client.users.cache.get(leader.id);
        user.send(message);
    }); 
}