const Storage = require('node-storage');
const path = require("path"); // from node.js
const config = {
    folderPath: './data'
};
module.exports = class AvalwynStorage {

    static instance;

    constructor() {
        if (AvalwynStorage.instance) {
            return AvalwynStorage.instance;
        }

        const bot_data_path = path.join(__dirname, `${config.folderPath}/bot_data`);
        this.bot_storage = new Storage(bot_data_path);

        const state_data_path = path.join(__dirname, `${config.folderPath}/state_data`);
        this.state_storage = new Storage(state_data_path);

        const active_channel_data_path = path.join(__dirname, `${config.folderPath}/active_channel_data`);
        this.active_channel_storage = new Storage(active_channel_data_path);

        const faction_data_path = path.join(__dirname, `${config.folderPath}/faction_data`);
        this.faction_storage = new Storage(faction_data_path);


        console.log(this.bot_storage);
        console.log(this.state_storage);
        console.log(this.active_channel_storage);
        console.log(this.faction_storage);
        AvalwynStorage.instance = this;
    }

}