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
        value: this.value
    });
}