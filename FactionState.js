module.exports = class FactionState {
    stateMachine = null;
    state_store = new Storage('./data/state_data');
    faction_key;

    constructor(faction_key) {
        this.faction_key = faction_key;
        this.stateForFaction();
    }

    isBattling() {
        return this.stateMachine.state === "battling";
    }

    isIdle() {
        return this.stateMachine.state === "idle";
    }

    battle () {
        this.stateMachine.battle();
    }

    cancelBattle () {
        this.stateMachine.cancelBattle();
    }

    finishBattle () {
        this.stateMachine.finishBattle();
    }

    onBattle = () =>  {
        this.saveCurrentState();
    }

    onCancelBattle = () =>  {
        this.saveCurrentState();
    }

    onFinishBattle = () => {
        this.saveCurrentState();
    }


    saveCurrentState = () =>  {
        this.state_store.put(this.faction_key + ".lastState", this.stateMachine.state);
    }

    stateForFaction = () => {
        let lastState = this.state_store.get(this.faction_key + ".lastState");
        if(!lastState) {
            lastState = "idle";
        }

        this.stateMachine = new StateMachine({
            init: "idle",
            transitions: [
              { name: 'battle', from: 'idle',  to: 'battling' },
              { name: 'cancelBattle', from: 'battling',  to: 'idle' },
              { name: 'finishBattle', from: 'battling', to: 'idle' },
              { name: 'goto', from: '*', to: function(s) { return s } }
            ],
            methods: {
              onBattle: this.onBattle,
              onCancelBattle: this.onCancelBattle,
              onFinishBattle: this.onFinishBattle
            }
        });

        this.stateMachine.goto(lastState);
    }

}