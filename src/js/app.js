const socket = io('localhost:5000');

const inputs = document.querySelectorAll('input.cv');

inputs.forEach(input => {
   input.addEventListener('change', onInputChange);
   input.addEventListener('mousemove', onInputChange);
});

function onInputChange(event) {
    if (event.buttons === 0) return;

    socket.emit('knob movement', {
        name: this.name,
        channel: this.dataset.channel,
        value: this.value
    });

    socket.on('knob movement', msg => {
        const thisKnob = findChannelInput(msg.channel);

        if ((thisKnob.value - msg.value) < 5) return;
        thisKnob.value = msg.value;
    });
}

function findChannelInput(channelNumber) {
    return Array.from(inputs)
        .find(input => input.dataset.channel === channelNumber);
}
