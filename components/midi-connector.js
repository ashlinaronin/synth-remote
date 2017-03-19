const midi = require('midi');
let output = new midi.output();
const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;

function playNote(channel, frequency, duration = 1000, velocity = 90) {
    const channelNoteOn = NOTE_ON + channel;
    const channelNoteOff = NOTE_OFF + channel;

    output.sendMessage([channelNoteOn, frequency, velocity]);

    setTimeout(() => {
        output.sendMessage([channelNoteOff, frequency, velocity]);
    }, duration);

    console.log(`played ${frequency} on channel ${channel} at ${velocity} for ${duration}`);
}

function initInterface() {
    const portCount = output.getPortCount();
    const portName = output.getPortName(0);

    if (portCount > 0) {
        output.openPort(0);
        console.log('connected to midi device', portName);
    }
}

module.exports = {
    initInterface,
    playNote
};