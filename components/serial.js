const serialport = require('serialport');
let activePort;

function checkForSerialPort() {
    serialport.list((err, ports) => {
        ports.forEach(port => {
            if (port.comName.indexOf('usb') > -1) {
                openSerialPort(port.comName);
            }
        });
    });
}

function openSerialPort(portName) {
    activePort = new serialport(portName, { baudRate: 9600, parser: serialport.parsers.readline('\n')});
    activePort.on('open', onSerialOpen);
    activePort.on('data', onSerialData);
    activePort.on('close', onSerialClose);
    activePort.on('error', onSerialError);

}

function onSerialOpen() {
    console.log('serial port opened');
    activePort.on('data', data => {
        console.log(data[0]);
    });
}

function onSerialData(data) {
    console.log('serial data: ', data);
}

function onSerialClose() {
    console.log('serial port closed');
}

function onSerialError(error) {
    console.log('serial port error: ', error);
}

function writeToSerial(msg) {
    if (!activePort) {
        console.log('no active serial port, cannot send msg');
    }
    console.log('writing to serial: ', msg);
    activePort.write(msg);
}

module.exports = {
    checkForSerialPort,
    openSerialPort,
    writeToSerial
};