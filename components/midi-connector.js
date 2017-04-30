const midi = require('midi');
let output = new midi.output();
const RPI_INVALID_MIDI_FRAGMENT = 'Through';
const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;

function playNote(channel, frequency, duration = 1000, velocity = 120) {
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

    if (portCount > 0) {
        for (let i = 0; i < portCount; i++) {
            const portName = output.getPortName(i);
            console.log('found first midi device:', portName);

            if (portName.indexOf(RPI_INVALID_MIDI_FRAGMENT === -1)) {
                output.openPort(i);
                console.log('connected to midi device', portName);
                return;
            }
        }
    }

    console.log('no appropriate midi devices found');
    process.exit();
}

module.exports = {
    initInterface,
    playNote
};