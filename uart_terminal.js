var BleUart = require('./ble-uart');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// use a predefined UART service (nordic, redbear, laird, bluegiga)
var bleSerial = new BleUart('nordic');

// optionally define a custom service
// var uart = {
//   serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
//   txUUID: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
//   rxUUID: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
// }
// var bleSerial = new BleUart('foo', uart);

// this function gets called when new data is received from
// the Bluetooth LE serial service:
bleSerial.on('data', function(data){
    process.stdout.write( String(data));
});

rl.on('line', (input) => {
  //console.log(`Received: ${input}`);
  bleSerial.write(input + "\r\n");
});

// this function gets called when the program
// establishes a connection with the remote BLE radio:
bleSerial.on('connected', function(data){
  console.log("Connected to device.");
  bleSerial.write("\xFF\xFF\xFF\xFF");
  bleSerial.write("AT+LOWPOWER=AUTOOFF\n");
  //bleSerial.write([1,2,3,4,5]);
  //bleSerial.write(new Uint8Array([5,4,3,2,1]));
  //bleSerial.write(new Buffer([6,7,8,9]))
});

bleSerial.on('disconnected', function(data){
  console.log("Disconnected");
  quit();
  //bleSerial.write([1,2,3,4,5]);
  //bleSerial.write(new Uint8Array([5,4,3,2,1]));
  //bleSerial.write(new Buffer([6,7,8,9]))
});
// thus function gets called if the radio successfully starts scanning:
bleSerial.on('scanning', function(status){
  console.log("radio status: " + status);
})
