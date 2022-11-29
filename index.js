const schedule = require('node-schedule');
const mqtt = require('mqtt')

try {
    client = mqtt.connect('mqtt:0.0.0.0');
  
    client.on("connect", () => {
      console.log("connected");
    });
  
    client.on("message", async (topic) => {
      if (topic === "device/client_error") {
        console.log("erro")
      }
    });
  } catch (e) {
    console.error(e);
    process.exit(0);
  }

client.subscribe("system/config/response");
client.subscribe("system/config");

const job = schedule.scheduleJob('* * * * * *', function(){
  batteryPower = [
    {
        execTime: "00:00:00",
        power: -500 // in wats chargin
    },
    {
        execTime: "15:00:00",
        power: 1000 // in wats discharging
    },
    {
        execTime: "16:00:00",
        power: 0 // in wats
    }
  ]

  let data  = {};
  data.batteryPowerSet = batteryPower;
  client.publish(`system/config`, JSON.stringify(data));

});

client.on('message', (topic,message) => {
    console.log(JSON.parse(message));
});