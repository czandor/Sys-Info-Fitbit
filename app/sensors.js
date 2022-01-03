import { display } from "display";
import { Accelerometer } from "accelerometer";
import { Barometer } from "barometer";
import { BodyPresenceSensor } from "body-presence";
import document from "document";
import { Gyroscope } from "gyroscope";
import { HeartRateSensor } from "heart-rate";
import { OrientationSensor } from "orientation";
import { geolocation } from "geolocation";
import { battery } from "power";
import { charger } from "power";
import sleep from "sleep"
import { today } from "user-activity";
import { vibration } from "haptics"


import { me as device } from "device";
if (!device.screen) device.screen = { width: 348, height: 250 };
device.ionic=(device.screen.width==348);
device.versa=(device.screen.width==300);
device.sense=(device.screen.width==336);



let visible=false;

const sensors = [];

let watchID = null;

let position=null;
let posError=null;
function locationSuccess(pos) {
  position=pos;
  posError=null;
}

function locationError(error) {
  position=null;
  posError=error;
}
if(Accelerometer) {
  const accel = new Accelerometer({ frequency: 1 });
  sensors.push(accel);
}

if(Barometer) {
  const barometer = new Barometer({ frequency: 1 });
  sensors.push(barometer);
}

if(BodyPresenceSensor) {
  const bps = new BodyPresenceSensor();
  sensors.push(bps);
}

if(Gyroscope) {
  const gyro = new Gyroscope({ frequency: 1 });
  sensors.push(gyro);
}

if(HeartRateSensor) {
  const hrm = new HeartRateSensor({ frequency: 1 });
  sensors.push(hrm);
}

if(OrientationSensor) {
  const orientation = new OrientationSensor({ frequency: 60 });
  sensors.push(orientation);
}

export function show(viewLoaded){
  if(device.sense && !visible && !viewLoaded) {
    document.location.assign("sub.view").then(() => {show(true)});
    return;
  }
  document.getElementById("sensorPage").style.display="inline";
  document.getElementById("sensorPage").animate("enable");
  document.getElementById("sensorScroll").value=0;
  
  visible=true;
  start();
}
export function hide(){
  if(document.getElementById("sensorPage")) document.getElementById("sensorPage").animate("disable");
  setTimeout(function(){
    if(device.sense && document.getElementById("sensorPage")) document.history.go(-1);
    visible=false;
    if(document.getElementById("sensorPage")) document.getElementById("sensorPage").style.display="none";
  },500);
  stop();
}
let updateTimer=null;
export function start(){
  if(!visible) return;
  document.getElementById("sensor-back").onclick=function(){
    vibration.start('bump');
    hide();
  }
  
  if(device.sense) document.onkeypress = function(e) {
    console.log("Button pressed (sensor): "+e.key);
    if(e.key=="back") {
      if(isVisible()){ 
        hide();
        e.preventDefault();
      }
      else vibration.start('ping');
    }
  }
  if(device.sense) document.onunload = () => {
    console.log("document unloaded");
    visible=false;
    vibration.start('bump');
    hide();
  };
  
  setTimeout(function(){
    sensors.map(sensor => sensor.start());
    watchID = geolocation.watchPosition(locationSuccess, locationError, { timeout: 60 * 1000 });
    //battery.onchange=function(evt){batteryUpdate();};
    //charger.onchange=function(evt){chargerUpdate();};
    //if(sleep) sleep.onchange = function(evt){sleepUpdate();};
    //batteryUpdate();
    //chargerUpdate();
    //if(sleep) sleepUpdate();
    if(updateTimer) clearInterval(updateTimer);
    updateTimer=setInterval(function(){update();},1000);
  },1000);
  
}
export function stop(){
  setTimeout(function(){
    sensors.map(sensor => sensor.stop());
    geolocation.clearWatch(watchID);
    //battery.onchange=undefined;
    //charger.onchange=undefined;
    //if(sleep) sleep.onchange = undefined;
    if(updateTimer){
      clearInterval(updateTimer);
      updateTimer=null;
    }
    
  },500);
}
export function isVisible(){
  return visible;
}
function update(){
  //return;
  display.poke();
  if(today) document.getElementById("health-data").text=''+today.local.steps+', '+((today.local.elevationGain != undefined)?today.local.elevationGain:'null')+', '+today.local.distance+', '+today.local.calories+', '+today.local.activeZoneMinutes.total+'';
  if(battery) batteryUpdate();
  if(charger) document.getElementById("power-data").text=''+((charger.connected)?'Connected'+', '+((charger.powerIsGood)?'power is good':'power is not good'):'Not conencted');
  if(sleep) document.getElementById("sleep-data").text=sleep.state;
  if(position) document.getElementById("gps-data").text="" + (position.coords.latitude.toFixed(10)*1)+", " + (position.coords.longitude.toFixed(10)*1);
  if(posError) document.getElementById("gps-data").text="" + posError.message+" ("+posError.code+")";
  if(Accelerometer) document.getElementById("accel-data").text='x:'+(accel.x ? accel.x.toFixed(3) : 0)+', '+'y:'+(accel.y ? accel.y.toFixed(3) : 0)+', z:'+(accel.z ? accel.z.toFixed(3) : 0);
  if(Barometer) document.getElementById("bar-data").text = ""+(barometer.pressure ? parseInt(barometer.pressure) : 0)+' Pa, '+((barometer.pressure ? parseInt(barometer.pressure) : 0)/100000).toFixed(2)+" Bar";
  if(BodyPresenceSensor) document.getElementById("bps-data").text=((bps.present)?'Present':'Not present');
  if(Gyroscope) document.getElementById("gyro-data").text='x:'+(gyro.x ? gyro.x.toFixed(3) : 0)+', '+'y:'+(gyro.y ? gyro.y.toFixed(3) : 0)+', z:'+(gyro.z ? gyro.z.toFixed(3) : 0);
  if(HeartRateSensor) document.getElementById("hrm-data").text=(hrm.heartRate ? hrm.heartRate+" BPM" : '---');
  if(OrientationSensor) document.getElementById("orientation-data").text=(orientation.quaternion?orientation.quaternion[0].toFixed(3)+', i:'+orientation.quaternion[1].toFixed(3)+', j:'+orientation.quaternion[2].toFixed(3)+', k:'+orientation.quaternion[3].toFixed(3)+'' : 'null');
}

function batteryUpdate(){
  //3-4,4v (3.85)
/*
ocv, ccv
100% 4.20V 100% 4.20V
90% 4.06V 90% 3.97V
80% 3.98V 80% 3.87V
70% 3.92V 70% 3.79V
60% 3.87V 60% 3.73V
50% 3.82V 50% 3.68V
40% 3.79V 40% 3.65V
30% 3.77V 30% 3.62V
20% 3.74V 20% 3.58V
10% 3.68V 10% 3.51V
5% 3.45V 5% 3.42V
0% 3.00V 0% 3.00V
*/
  const min=3;
  const max=4.4;
  if(device.ionic){
    max=4.35;
  }
  let voltage=((((max-min)/100)*battery.chargeLevel)+min+((battery.charging)?0.05:0)).toFixed(2)*1;
  document.getElementById("battery-data").text=''+battery.chargeLevel+'%, '+voltage+'V, '+((battery.charging)?"charging":"discharging")+'';
}

