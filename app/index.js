import { display } from "display";
import document from "document";
import * as sensors from "./sensors";
import * as info from "./info";
import * as test from "./test";
import { vibration } from "haptics"
/*
TODO::::
FCCID
Lite onboard storage (4GB!!!!)
XRA-FB503: ionic
XRA-FB507: versa2
XRA-FB415: versa lite
XRA-FB504: versa
XRA-FB505: Versa Special
XRA-FB512: Sense
XRA-FB511: Versa3
*/

display.autoOff=false;
display.on=true;

document.onkeypress = function(e) {
  console.log("Button pressed: "+e.key);
  if(e.key=="back") {
    let wasVisible=false;
    if(sensors.isVisible()) {
      sensors.hide();
      wasVisible=true;
    }
    if(info.isVisible()) {
      info.hide();
      wasVisible=true;
    }
    if(test.isVisible()) {
      test.hide();
      wasVisible=true;
    }
    if(wasVisible) e.preventDefault();
    else vibration.start('ping');
  }
}
 
document.getElementById("deviceImage").href=info.getDeviceImage();

document.getElementById("sensorButton").onclick=function(){
  sensors.show();
  vibration.start('bump');
};
document.getElementById("infoButton").onclick=function(){
  info.show(1);
  vibration.start('bump');
};
document.getElementById("testButton").onclick=function(){
  test.show();
  vibration.start('bump');
};
//test.show();
display.addEventListener("change", () => {
  // Automatically stop all sensors when the screen is off to conserve battery
  if(display.on){
    //sensors.show();
    sensors.start();
  }
  else{
    sensors.stop();
    //display.poke();
  }
});
