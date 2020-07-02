const Storage = require('node-storage');
const faction_store = new Storage('./data/faction_data');

module.exports = (faction_key, user) => {
    if(!faction_key || !user) return;

    const faction = faction_store.get(faction_key);
    if (!faction) return;

    faction.leaders.push(user);

    faction_store.put(faction_key, faction);
}