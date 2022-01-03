import document from "document";
import { units } from "user-settings";
import { display } from "display";
import { memory } from "system";
import { vibration } from "haptics"


import { data as atlas } from "../common/atlas";
import { data as gemini } from "../common/gemini";
import { data as higgs } from "../common/higgs";
import { data as meson } from "../common/meson";
import { data as mira } from "../common/mira";
import { data as vulcan } from "../common/vulcan";
import { data as unknown } from "../common/unknown";

import { existsSync } from "fs";

import { me as device } from "device";
if (!device.screen) device.screen = { width: 348, height: 250 };
device.ionic=(device.screen.width==348);
device.versa=(device.screen.width==300);
device.sense=(device.screen.width==336);

/* TODO
fw version
sw version
battery
sdk version
api version
*/

let visible=0;
let dataFilled=false;


export function show(subpage,viewLoaded){
  if(device.sense && visible==0 && !viewLoaded) {
    document.location.assign("sub.view").then(() => {show(subpage,true)});
    return;
  }
  if(visible==0) document.getElementById("infoPage").animate("enable");
  visible=subpage;
  for(let i=1 ; i<=3 ; i++) {
    let d="inline";
    if(i!=visible) d="none";
    document.getElementById("info"+i+"Scroll").style.display=d;
    document.getElementById("info"+i+"Scroll").value=0;
  }
  document.getElementById("infoPage").style.display='inline';
  start();
}
export function hide(){
  if(document.getElementById("infoPage")) document.getElementById("infoPage").animate("disable");
  setTimeout(function(){
    //show(0);
    if(device.sense && document.getElementById("infoPage")) document.history.go(-1);
    visible=0;
    dataFilled=false;
  },500);
  stop();
}
export function start(){
  document.getElementById("info1-back").onclick=function(){
    vibration.start('bump');
    hide();
  }
  document.getElementById("info11-button").onclick=function(){
    vibration.start('bump');
    show(1);
  }
  document.getElementById("info12-button").onclick=function(){
    vibration.start('bump');
    show(2);
  }
  document.getElementById("info13-button").onclick=function(){
    vibration.start('bump');
    show(3);
  }

  document.getElementById("info2-back").onclick=function(){
    vibration.start('bump');
    hide();
  }
  document.getElementById("info21-button").onclick=function(){
    vibration.start('bump');
    show(1);
  }
  document.getElementById("info22-button").onclick=function(){
    vibration.start('bump');
    show(2);
  }
  document.getElementById("info23-button").onclick=function(){
    vibration.start('bump');
    show(3);
  }
  document.getElementById("info3-back").onclick=function(){
    vibration.start('bump');
    hide();
  }
  document.getElementById("info31-button").onclick=function(){
    vibration.start('bump');
    show(1);
  }
  document.getElementById("info32-button").onclick=function(){
    vibration.start('bump');
    show(2);
  }
  document.getElementById("info33-button").onclick=function(){
    vibration.start('bump');
    show(3);
  }
  if(device.sense) document.onkeypress = function(e) {
    console.log("Button pressed (info): "+e.key);
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
    visible=0;
    vibration.start('bump');
    hide();
  };
  setTimeout(function(){
    fillData();
  },1000);
  
}
export function stop(){
  
}
export function isVisible(){
  return (visible>0);
}
function getDeviceData(){
  let id=device.modelId*1;
  console.log('modelId: '+id);
  let data=unknown;
  if(atlas.modelIds.indexOf(id) > -1) data=atlas;
  if(gemini.modelIds.indexOf(id) > -1) data=gemini;
  if(higgs.modelIds.indexOf(id) > -1) data=higgs;
  if(meson.modelIds.indexOf(id) > -1) data=meson;
  if(mira.modelIds.indexOf(id) > -1) data=mira;
  if(vulcan.modelIds.indexOf(id) > -1) data=vulcan;
  return data;
}
function fillData(){
  if (dataFilled) return;
  
  let data=getDeviceData();
  document.getElementById("name-data").text='Fitbit '+device.modelName;
  document.getElementById("alias-data").text=data['alias'];
  document.getElementById("modelId-data").text=device.modelId;
  document.getElementById("release-data").text=data['Release'];
  if(units.distance == "metric") document.getElementById("case-data").text='WxHxT '+data['Case Dimensions'][0]+'x'+data['Case Dimensions'][1]+'x'+data['Case Dimensions'][2]+' mm';
  else document.getElementById("case-data").text='WxHxT '+convertMmToInches(data['Case Dimensions'][0])+'x'+convertMmToInches(data['Case Dimensions'][1])+'x'+convertMmToInches(data['Case Dimensions'][2])+' in';
  document.getElementById("material-data").text=data['Case/Bezel'];
  document.getElementById("buttons-data").text=data['Buttons'];
  document.getElementById("weight-data").text=data['Weight']+' grams, '+convertGramToOunces(data['Weight'])+' oz';
  document.getElementById("color-data").text=getColor(data['Colors']);
  document.getElementById("screentype-data").text=data['Screen Type'];
  document.getElementById("screensize-data").text=data['Screen Size']+' in';
  document.getElementById("screenresolution-data").text=device.screen.width+'x'+device.screen.height+' px';
  document.getElementById("screenppi-data").text=(Math.sqrt((device.screen.width*device.screen.width)+(device.screen.height*device.screen.height))/data['Screen Size']).toFixed(0)+" PPI";
  document.getElementById("brightness-data").text=data['Display Brightness']+' NIT';
  //document.getElementById("touch-data").text=data['Multi Touch'];
  document.getElementById("protection-data").text=data['Screen Protection'];
  document.getElementById("chipset-data").text=data['Chipset'];
  document.getElementById("fabric-data").text=(data['Fabric'] || 'unknown')+' nm';
  document.getElementById("cpu-data").text=data['CPU'];
  document.getElementById("gpu-data").text=data['GPU'];
  document.getElementById("ram-data").text=(data['RAM'] || 'unknown')+' MB';
  document.getElementById("flash-data").text=data['Flash']+' GB';
  document.getElementById("flashavailable-data").text=data['Flash Available']+' GB';
  document.getElementById("cellular-data").text=data['Cellular'];
  document.getElementById("bluetooth-data").text=data['Bluetooth'];
  document.getElementById("gpschip-data").text=data['GPS'];
  document.getElementById("wifi-data").text=data['WiFi'];
  document.getElementById("nfc-data").text=data['NFC'];
  document.getElementById("microphone-data").text=data['Microphone'];
  document.getElementById("speaker-data").text=data['Speaker'];
  document.getElementById("voice-data").text=data['Voice command'];
  document.getElementById("batterysize-data").text=data['Battery Capacity']+' mAh, '+data['Battery Voltage']+' V ('+((data['Battery Capacity']*data['Battery Voltage'])/1000).toFixed(2)+' Wh)';
  document.getElementById("charging-data").text=data['Charging'];
  document.getElementById("accelerometer-data").text=data['Accelerometer'];
  document.getElementById("gyrochip-data").text=data['Gyro'];
  document.getElementById("heartrate-data").text=data['Heart Rate'];
  document.getElementById("light-data").text=data['Light'];
  document.getElementById("compass-data").text=data['Compass/Magnetometer'];
  document.getElementById("vibration-data").text=data['Vibration/Haptics engine'];
  document.getElementById("altimeter-data").text=data['Altimeter'];
  document.getElementById("spo2-data").text=data['Sp02 Sensor'];
  document.getElementById("skin-data").text=data['Skin Temperature'];
  document.getElementById("ecg-data").text=data['ECG'];
  document.getElementById("eda-data").text=data['EDA Scanner'];
  document.getElementById("music-data").text=data['Music Storage'];
  document.getElementById("iprating-data").text=data['IP Rating'];
  document.getElementById("fw-data").text=device.firmwareVersion;
  document.getElementById("aod-data").text=(display.aodAvailable)?'Available':'Not available';
  document.getElementById("memjs-data").text=memory.js.total+' bytes ('+Math.round(memory.js.total/1024)+' kB)';
  document.getElementById("fcc-data").text=data['FCC'];
  document.getElementById("strap-data").text=data['Strap'];
  dataFilled=true;
}
function convertMmToInches(mm){
    let inches = mm/25.4;
    inches = inches.toPrecision(2);
    return inches;
}
function convertGramToOunces(g){
  let ounces=g*0.035274;
  ounces = ounces.toPrecision(2);
  return ounces;
}
function getColor(db){
  let dev=(device.bodyColor || 'unknown');
  //console.log((dev in db));
  if(!(dev in db)) {
    let a=[];
    for (const property in db) a.push(db[property]);
    return a.join(', ');
  }
  return db[dev];
}
export function getDeviceImage(){
  let data=getDeviceData();
  let color=(device.bodyColor || 'unknown');
  //color="pale-yellow-gold";
  //if(data['alias'] == 'unknown') return "images/devices/unknown.png";
  if(existsSync("/mnt/assets/resources/images/devices/"+data['alias']+"-"+color+".png.txi")) return "images/devices/"+data['alias']+"-"+color+".png";
  if(existsSync("/mnt/assets/resources/images/devices/"+data['alias']+"-unknown.png.txi")) return "images/devices/"+data['alias']+"-unknown.png";
  return "images/devices/unknown.png";
}