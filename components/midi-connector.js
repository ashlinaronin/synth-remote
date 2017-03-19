const midi = require('midi');
let output = new midi.output();
const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;

function playNote(channel, frequency, duration = 1000, velocity = 120) {
    const channelNoteOn = NOTE_ON + channel;
    const channelNoteOff = NOTE_OFF + channel;
    const mappedFrequency = mapSliderToMidi(frequency);

    output.sendMessage([channelNoteOn, mappedFrequency, velocity]);

    setTimeout(() => {
        output.sendMessage([channelNoteOff, mappedFrequency, velocity]);
    }, duration);

    console.log(`played ${mappedFrequency} on channel ${channel} at ${velocity} for ${duration}`);
}

function initInterface() {
    const portCount = output.getPortCount();
    const portName = output.getPortName(0);

    if (portCount > 0) {
        output.openPort(0);
        output.openVirtualPort('test output');
        console.log('connected to midi device', portName);
    }
}

function mapSliderToMidi(value) {
    return Math.ceil(mapRange(value, 0, 100, 0, 127));
}

function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

module.exports = {
    initInterface,
    playNote
};