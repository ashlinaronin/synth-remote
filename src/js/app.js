const socket = io('localhost:5000');
const inputs = document.querySelectorAll('.cv');
let knobsInUse = [];

inputs.forEach(input => initializeSlider(input));
socket.on('current knob state', updateState);

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
        if (typeof channel === 'undefined') {
            console.log('input found without channel data attribute, skipping update...');
            return;
        }

        if (!msg.hasOwnProperty(channel)) {
            console.log('no state received for this input, skipping update...');
            return;
        }


        if (knobsInUse[channel]) {
            console.log('this input is being used, skipping update...');
            return;
        }

        if (input.noUiSlider.get() === msg[channel]) {
            console.log('value is unchanged, skipping update...');
            return;
        }

        input.noUiSlider.set(msg[channel]);
        console.log(`updated ${input.dataset.parameter} to ${msg[channel]}`);
    });
}