const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const midiConnector = require('./components/midi-connector');
let values = [];

midiConnector.initInterface();


io.on('connection', socket => {
    console.log('a user connected');

    socket.on('knob movement', msg => {
        midiConnector.playNote(parseInt(msg.channel), parseInt(msg.value));
        console.log('msg: ', msg);

        if (typeof values[msg.channel] !== 'undefined') {
            if (Math.abs(msg.value - values[msg.channel]) > 5) {
                io.emit('knob movement', msg);
            }
        }

        values[msg.channel] = msg.value;
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(5000, () => {
    console.log('listening on *:5000');
});

