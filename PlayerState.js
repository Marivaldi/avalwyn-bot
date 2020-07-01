var StateMachine = require('javascript-state-machine');
var Storage = require('node-storage');


module.exports = class PlayerState {
    stateMachine = null;
    state_store = new Storage('./data/state_data');
    user_id;

    constructor(user_id) {
        this.user_id = user_id;
        this.stateForUser();
    }

    currentState() {
        return this.stateMachine.state;
    }

    start () {
        this.stateMachine.start();
    }

    sayYes() {
        this.stateMachine.sayYes();
    }

    sayNo() {
        this.stateMachine.sayNo();
    }

    chooseFaction() {
        this.stateMachine.chooseFaction();
    }

    quit() {
        this.stateMachine.quit();
    }

    onStart = () =>  {
        this.saveCurrentState();
    }

    onSayNo = () =>  {
        this.saveCurrentState();
    }

    onSayYes = () => {
        this.saveCurrentState();
    }

    onChooseFaction = () => {
        this.saveCurrentState();
    }

    onQuit = () => {
        this.saveCurrentState();
    }

    saveCurrentState = () =>  {
        this.state_store.put(this.user_id + ".lastState", this.stateMachine.state);
    }

    stateForUser = () => {
        let lastState = this.state_store.get(this.user_id + ".lastState");
        if(!lastState) {
            lastState = "prestart";
        }

        this.stateMachine = new StateMachine({
            init: "prestart",
            transitions: [
              { name: 'start', from: 'prestart',  to: 'start' },
              { name: 'sayNo', from: 'start',  to: 'prestart' },
              { name: 'sayYes', from: 'start', to: 'factionSelection' },
              { name: 'chooseFaction', from: 'factionSelection', to: 'playMode'},
              { name: 'quit', from: '*', to: 'prestart' },
              { name: 'goto', from: '*', to: function(s) { return s } }
            ],
            methods: {
              onStart: this.onStart,
              onSayNo: this.onSayNo,
              onSayYes: this.onSayYes,
              onQuit: this.onQuit,
              onChooseFaction: this.onChooseFaction
            }
        });

        this.stateMachine.goto(lastState);
    }

}