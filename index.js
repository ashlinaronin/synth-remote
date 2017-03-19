const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const midiConnector = require('./components/midi-connector');

midiConnector.initInterface();

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

io.on('connection', socket => {
    console.log('a user connected');

    socket.on('knob movement', msg => {
        midiConnector.playNote(parseInt(msg.channel), parseInt(msg.value));
        console.log('msg: ', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(5000, () => {
    console.log('listening on *:3000');
});

