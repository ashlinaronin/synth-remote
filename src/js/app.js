const apiBaseUrl = '@@apiBaseUrl';
const socket = io(apiBaseUrl);
const inputs = document.querySelectorAll('.cv');
const CONNECTION_LIMIT_REACHED = 'CONNECTION_LIMIT_REACHED';
const USER_DISCONNECTED = 'USER_DISCONNECTED';
let knobsInUse = [];

inputs.forEach(input => initializeSlider(input));
socket.on('current knob state', updateState);
socket.on(CONNECTION_LIMIT_REACHED, msg => {
    document.querySelector('body').classList.add('error');
});

// Re-enable controls for this user if the total user count is now <=10.
// This works, but isn't quite ideal logically because we are not
// tracking who is actually active, but just who is connected
// So theoretically there could be 15 users connected, 10 active
// When one disconnects, you would expect one slot to be open
// But currently that slot will not be freed until 5 users disconnect
// and there are only 10 total users.
// TODO: implement queue
socket.on(USER_DISCONNECTED, userCount => {
   if (userCount <= 10) {
       document.querySelector('body').classList.remove('error');
   }
});

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