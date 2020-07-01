const PlayerState = require("../PlayerState");

module.exports = (message) => {
    if(!message) return;

    const player_state = new PlayerState(message.author.id);
    const isInProperState = player_state.stateMachine.can('sayYes');
    if(!isInProperState) {
        message.author.send("Invalid Command in your current context.");
        return;
    }

    player_state.sayNo();

    message.author.send("Fine... Be that way.");
}