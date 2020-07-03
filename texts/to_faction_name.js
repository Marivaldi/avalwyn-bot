const faction_text = require('./faction_text.json');

module.exports = (faction_key) => {
    if(!faction_key in faction_text) return "BAD FACTION KEY";
    return faction_text[faction_key].name;
}