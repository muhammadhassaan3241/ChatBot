const { machineId, machineIdSync } = require("node-machine-id");

// Asyncronous call with async/await or Promise

async function getMachineId() {
  var id = await machineId();
}

machineId().then((id) => {
  console.log({ MachineId: id });
});

// Syncronous call
var id = machineIdSync();
// id = c24b0fe51856497eebb6a2bfcd120247aac0d6334d670bb92e09a00ce8169365
var id = machineIdSync({ original: true });
// id = 98912984-c4e9-5ceb-8000-03882a0485e4
module.exports = id;
