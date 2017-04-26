const socket = io('10.0.1.33:5000');
const inputs = document.querySelectorAll('.cv');

inputs.forEach(input => initializeSlider(input));

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

    input.noUiSlider.on('update', onSliderUpdate);
}

function onSliderUpdate(values) {
    socket.emit('knob movement', {
        name: this.target.dataset.parameter,
        channel: this.target.dataset.channel,
        value: values[0]
    });

    socket.on('knob movement', msg => {
        const thisKnob = findChannelInput(msg.channel);

        const difference = thisKnob.noUiSlider.get() - msg.value;
        console.log('difference', difference);

        if (Math.abs(difference) > 5) return;
        thisKnob.noUiSlider.set(msg.value);
        console.log(`updated ${thisKnob.dataset.parameter} to ${msg.value}`);
    });
}

function findChannelInput(channelNumber) {
    return Array.from(inputs)
        .find(input => input.dataset.channel === channelNumber);
}
