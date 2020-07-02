const Storage = require('node-storage');
const faction_store = new Storage('./data/faction_data');

module.exports = (message, faction_key, client) => {
    const faction = faction_store.get(faction_key);
    if(!faction) return;

    faction.leaders.forEach(leader => {
        const user = client.users.cache.get(leader.id);
        user.send(message);
    }); 
}