const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const midi = require('midi');

let output = new midi.output();

let portCount = output.getPortCount();
let portName = output.getPortName(0);

if (portCount > 0) {
    output.openPort(0);
    console.log('connected to midi device', portName);
    output.sendMessage([176, 22, 1]);

}



app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

io.on('connection', socket => {
    console.log('a user connected');

    const CHANNEL_1_NOTE_ON = 144;
    const CHANNEL_1_NOTE_OFF = 128;

    socket.on('knob movement', msg => {
        output.sendMessage([CHANNEL_1_NOTE_ON, 64, 90]);
        output.sendMessage([CHANNEL_1_NOTE_OFF, 64, 0]);
       console.log('msg: ', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(5000, () => {
    console.log('listening on *:3000');
});

