const resource_texts = require('./resource_text.json');
module.exports = (faction_key, resource_key) => {
    if(!faction_key in resource_texts) return "BAD FACTION KEY";
    const faction_resource_text = resource_texts[faction_key]
    console.log(faction_resource_text);

    if(!resource_key in faction_resource_text) return "BAD RESOURCE KEY";

    return faction_resource_text[resource_key];
}