const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const ip = require('ip');
const debounce = require('debounce');
const midiConnector = require('./components/midi-connector');
const tunnel = require('./components/tunnel');
const appVersion = require('./package.json').version;
const serverPort = 5000;
const interval = 1000;
const LOCALTUNNEL_CONN_LIMIT = 10;
const CONNECTION_LIMIT_REACHED = 'CONNECTION_LIMIT_REACHED';
const USER_DISCONNECTED = 'USER_DISCONNECTED';
let knobStates = [];
let intervalId;

console.log(`starting up droneweb v${appVersion}`);
midiConnector.initInterface();
tunnel.setupTunnel('droneweb');
startSendingState();
io.on('connection', initializeSocket);


function initializeSocket(socket) {
    console.log(`user ${socket.id} connected from ${socket.conn.remoteAddress}`);
    console.log('clients count', this.server.engine.clientsCount);

    if (this.server.engine.clientsCount > LOCALTUNNEL_CONN_LIMIT) {
        io.to(socket.id).emit('CONNECTION_LIMIT_REACHED');
    }

    socket.on('knob movement', debounce(onSocketKnobMovement, 50));
    socket.on('disconnect', onSocketDisconnect);
}

function onSocketKnobMovement(msg) {
    console.log(`msg from ${this.id}:`, msg);
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
    console.log('user disconnected, clients count', this.server.engine.clientsCount);
    io.emit(USER_DISCONNECTED, this.server.engine.clientsCount);
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

http.listen(serverPort, () => {
    console.log(`droneweb server running at ${ip.address()}:${serverPort}`);
});

