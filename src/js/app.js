const apiBaseUrl = '@@apiBaseUrl';
const socket = io(apiBaseUrl);
const inputs = document.querySelectorAll('.cv');
let knobsInUse = [];

inputs.forEach(input => initializeSlider(input));
// socket.on('current knob state', updateState);

function initializeSlider(input) {
    noUiSlider.create(input, {
        start: 63,
        behaviour: 'tap',
        connect: [false, true],
        range: {
            'min': 0,
            'max': 127
        },
        format: {
            to: value => Math.ceil(value),
            from: value => value.toString()
        }
    });

    knobsInUse[input.dataset.channel] = false;

    input.noUiSlider.on('start', () => {
       knobsInUse[input.dataset.channel] = true;
    });

    input.noUiSlider.on('end', () => {
        knobsInUse[input.dataset.channel] = false;
    });

    input.noUiSlider.on('update', onSliderUpdate);
}

function onSliderUpdate(values) {
    socket.emit('knob movement', {
        name: this.target.dataset.parameter,
        channel: this.target.dataset.channel,
        value: values[0]
    });
}

function updateState(msg) {
    inputs.forEach(input => {
        let channel = input.dataset.channel;

        // Don't update this input if the element does not have a channel data attribute
        if (typeof channel === 'undefined') return;

        // Don't update this input if the update state message doesn't contain a value for this channel
        if (!msg.hasOwnProperty(channel)) return;

        // Don't update this input if this knob is currently being dragged
        if (knobsInUse[channel]) return;

        // Don't update this input if the value received from the server matches its current value
        if (input.noUiSlider.get() === msg[channel]) return;

        input.noUiSlider.set(msg[channel]);

        console.log(`updated ${input.dataset.parameter} to ${msg[channel]} from server state`);
    });
}