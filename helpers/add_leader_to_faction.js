const AvalwynStorage = require('../AvalwynStorage');

module.exports = (faction_key, user) => {
    const faction_store = new AvalwynStorage().faction_storage;
    if(!faction_key || !user) return;

    const faction = faction_store.get(faction_key);
    if (!faction) return;

    faction.leaders.push(user);

    faction_store.put(faction_key, faction);
}