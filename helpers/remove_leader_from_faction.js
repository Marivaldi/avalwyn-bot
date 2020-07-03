const AvalwynStorage = require('../AvalwynStorage');

module.exports = (faction_key, user) => {
    const faction_store = new AvalwynStorage().faction_storage;
    if(!faction_key || !user) return;

    const faction = faction_store.get(faction_key);
    if (!faction) return;

    const leaders = faction.leaders.filter((leader) => leader.id !== user.id);

    faction_store.put(`${faction_key}.leaders`, leaders);
}