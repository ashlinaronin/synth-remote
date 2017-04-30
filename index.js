const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const midiConnector = require('./components/midi-connector');
const interval = 100;
let knobStates = [];
let intervalId;


midiConnector.initInterface();
startSendingState();
io.on('connection', initializeSocket);


function initializeSocket(socket) {
    console.log('a user connected');
    socket.on('knob movement', onSocketKnobMovement);
    socket.on('disconnect', onSocketDisconnect);
}

function onSocketKnobMovement(msg) {
    console.log('msg: ', msg);
    midiConnector.playNote(parseInt(msg.channel), parseInt(msg.value));
    updateState(msg);
}

function updateState(knobMovementMessage) {
    if (typeof knobMovementMessage.channel === 'undefined' ||
        typeof knobMovementMessage.value === 'undefined') {
        console.log('incomplete knob movement message received, skipping');
        return;
    }

    knobStates[parseInt(knobMovementMessage.channel)] = knobMovementMessage.value;
}

function onSocketDisconnect() {
    console.log('user disconnected');
}

function startSendingState() {
    intervalId = setInterval(sendState, interval);
}

function stopSendingState() {
    clearInterval(intervalId);
}

function sendState() {
    io.emit('current knob state', knobStates);
}

http.listen(5000, () => {
    console.log('listening on *:5000');
});

