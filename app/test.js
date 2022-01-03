import { display } from "display";
import document from "document";
import { vibration } from "haptics"
import * as scientific from "scientific";
import * as fs from "fs";
import jpeg from "jpeg";

const RESULTS={
  'ionic' :[7186,16214,5210,4084],
  'versa' :[7205,16102,6249,5343],
  'versa2':[4758,3515,1800,2064],
  'sense' :[4476,3224,1875,2585]
};
const NAMES={'ionic':'Ionic','versa':'Versa / Versa lite','versa2':'Versa 2','sense':'Versa 3 / Sense','your':'Your device'};
const BARFULLWIDTH=300;

import { me as device } from "device";
if (!device.screen) device.screen = { width: 348, height: 250 };
device.ionic=(device.screen.width==348);
device.versa=(device.screen.width==300);
device.sense=(device.screen.width==336);

let visible=false;

export function show(viewLoaded){
  if(device.sense && !visible && !viewLoaded) {
    document.location.assign("sub.view").then(() => {show(true)});
    return;
  }
  if(!visible) document.getElementById("testPage").animate("enable");
  visible=true;
  document.getElementById("testPage").style.display='inline';
  start();
}
export function hide(){
  //vibration.start('bump');
  if(document.getElementById("testPage")) document.getElementById("testPage").animate("disable");
  setTimeout(function(){
    //show(0);
    if(device.sense && document.getElementById("testPage")) document.history.go(-1);
    visible=false;
  },500);
  stop();
}
let detailedRows=[false,false,false,false,false];
export function start(){
  detailedRows=[false,false,false,false,false];
  document.getElementById("test-back").onclick=function(){
    vibration.start('bump');
    hide();
  }
  document.getElementById("teststart-button").onclick=function(){
    vibration.start('bump');
    startTest();
  }
  document.getElementById("test-comparison-item-1").onclick=function(){
    vibration.start('bump');
    detailedRows[0]=!detailedRows[0];
    drawBars();
  }
  document.getElementById("test-comparison-item-2").onclick=function(){
    vibration.start('bump');
    detailedRows[1]=!detailedRows[1];
    drawBars();
  }
  document.getElementById("test-comparison-item-3").onclick=function(){
    vibration.start('bump');
    detailedRows[2]=!detailedRows[2];
    drawBars();
  }
  document.getElementById("test-comparison-item-4").onclick=function(){
    vibration.start('bump');
    detailedRows[3]=!detailedRows[3];
    drawBars();
  }
  document.getElementById("test-comparison-item-5").onclick=function(){
    vibration.start('bump');
    detailedRows[4]=!detailedRows[4];
    drawBars();
  }
  document.getElementById("test-type-data").text="&nbsp;";
  document.getElementById("test-cpu-data").text="{ ... }";
  document.getElementById("test-mem-data").text="{ ... }";
  document.getElementById("test-file-data").text="{ ... }";
  document.getElementById("test-vga-data").text="{ ... }";
  document.getElementById("teststart-button").style.display='inline'
  document.getElementById("testScroll").value=0;
  drawBars();
  if(device.sense) document.onkeypress = function(e) {
    console.log("Button pressed (test): "+e.key);
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
    fillData();
  },1000);
  
}

export function stop(){
  
}




export function isVisible(){
  return (visible);
}

function fillData(){
  
}
let mss=[0,0,0,0];
function startTest(test){
  if(!test){
    document.getElementById("teststart-button").style.display='none';
    setTimeout(function(){
      startVGA();
      startTest(1);
    },100);
    mss=[0,0,0,0];
    detailedRows=[false,false,false,false,false]
    document.getElementById("test-type-data").text="Warming up...";
    return;
  }
  if(!isVisible()) return;
  display.poke();
  // integer
  // float
  // string
  // bitops
  // array
  // regexp
  // scientific
  // date
  // fs
  // jpeg
  let startTime=0;
  let res=0;
  if(test==1){
    document.getElementById("test-type-data").text="Integer test...";
    setTimeout(function(){
      startTime=Date.now();
      res=startInteger();
      mss[0]+=Date.now()-startTime;
      if(!isVisible()) return;
      console.log('startInteger: '+(Date.now()-startTime)+' '+res);
      document.getElementById("test-cpu-data").text='CPU 25%...';
      setTimeout(function(){startTest(test+1);},100);
    },100);
    return;
  }
  
  if(test==2){
    document.getElementById("test-type-data").text="Float test...";
    setTimeout(function(){
      startTime=Date.now();
      res=startFloat();
      mss[0]+=Date.now()-startTime;
      if(!isVisible()) return;
      console.log('startFloat: '+(Date.now()-startTime)+' '+res);
      document.getElementById("test-cpu-data").text='CPU 50%...';
      setTimeout(function(){startTest(test+1);},100);
    },100);
    return;
  }
  
  if(test==3){
    document.getElementById("test-type-data").text="Bitops test...";
    setTimeout(function(){
      startTime=Date.now();
      res=startBitops();
      mss[0]+=Date.now()-startTime;
      if(!isVisible()) return;
      console.log('startBitops: '+(Date.now()-startTime)+' '+res);
      document.getElementById("test-cpu-data").text='CPU 75%...';
      setTimeout(function(){startTest(test+1);},100);
    },100);
    return;
  }

  if(test==4){
    document.getElementById("test-type-data").text="Regexp test...";
    setTimeout(function(){
      startTime=Date.now();
      res=startRegexp();
      mss[0]+=Date.now()-startTime;
      if(!isVisible()) return;
      console.log('startRegexp: '+(Date.now()-startTime)+' '+res);
      document.getElementById("test-cpu-data").text='CPU: '+(mss[0])+' ms';
      setTimeout(function(){startTest(test+1);},100);
    },100);
    return;
  }

  if(test==5){
    document.getElementById("test-type-data").text="String test...";
    setTimeout(function(){
      startTime=Date.now();
      res=startString();
      mss[1]+=Date.now()-startTime;
      if(!isVisible()) return;
      console.log('startString: '+(Date.now()-startTime)+' '+res);
      document.getElementById("test-mem-data").text='MEM: 25%...';
      setTimeout(function(){startTest(test+1);},100);
    },100);
    return;
  }

  if(test==6){
    document.getElementById("test-type-data").text="Array test...";
    setTimeout(function(){
      startTime=Date.now();
      res=startArray();
      mss[1]+=Date.now()-startTime;
      if(!isVisible()) return;
      console.log('startArray: '+(Date.now()-startTime)+' '+res);
      document.getElementById("test-mem-data").text='MEM 50%...';
      setTimeout(function(){startTest(test+1);},100);
    },100);
    return;
  }

  if(test==7){
    document.getElementById("test-type-data").text="Scientific test...";
    setTimeout(function(){
      startTime=Date.now();
      res=startScientific();
      mss[1]+=Date.now()-startTime;
      if(!isVisible()) return;
      console.log('startScientific: '+(Date.now()-startTime)+' '+res);
      document.getElementById("test-mem-data").text='MEM 75%...';
      setTimeout(function(){startTest(test+1);},100);
    },100);
    return;
  }

  if(test==8){
    document.getElementById("test-type-data").text="Date test...";
    setTimeout(function(){
      startTime=Date.now();
      res=startDate();
      mss[1]+=Date.now()-startTime;
      if(!isVisible()) return;
      console.log('startDate: '+(Date.now()-startTime)+' '+res);
      document.getElementById("test-mem-data").text='MEM: '+(mss[1])+' ms';
      setTimeout(function(){startTest(test+1);},100);
    },100);
    return;
  }

  if(test==9){
    document.getElementById("test-type-data").text="File-system test...";
    setTimeout(function(){
      startTime=Date.now();
      res=startFS(1);
      mss[2]+=Date.now()-startTime;
      if(!isVisible()) return;
      console.log('startFS1: '+(Date.now()-startTime)+' '+res);
      document.getElementById("test-file-data").text='FILE: 25%...';
      setTimeout(function(){startTest(test+1);},100);
    },100);
    return;
  }

   if(test==10){
    document.getElementById("test-type-data").text="File read test...";
    setTimeout(function(){
      startTime=Date.now();
      res=startFS(2);
      mss[2]+=Date.now()-startTime;
      if(!isVisible()) return;
      console.log('startFS2: '+(Date.now()-startTime)+' '+res);
      document.getElementById("test-file-data").text='FILE: 50%...';
      setTimeout(function(){startTest(test+1);},100);
    },100);
    return;
  }

   if(test==11){
    document.getElementById("test-type-data").text="File write test...";
    setTimeout(function(){
      startTime=Date.now();
      res=startFS(3);
      mss[2]+=Date.now()-startTime;
      if(!isVisible()) return;
      console.log('startFS3: '+(Date.now()-startTime)+' '+res);
      document.getElementById("test-file-data").text='FILE: 75%...';
      setTimeout(function(){startTest(test+1);},100);
    },100);
    return;
  }

  if(test==12){
    document.getElementById("test-type-data").text="Jpeg decode test...";
    setTimeout(function(){
      startTime=Date.now();
      res=startJpeg();
      mss[2]+=Date.now()-startTime;
      if(!isVisible()) return;
      console.log('startJpeg: '+(Date.now()-startTime)+' '+res);
      document.getElementById("test-file-data").text='FILE: '+(mss[2])+' ms';
      setTimeout(function(){startTest(test+1);},100);
    },100);
    return;
  }
  
  if(test==13){
    document.getElementById("test-type-data").text="Colorize test...";
    setTimeout(function(){
      startTime=Date.now();
      res=startVGA(1);
      mss[3]+=Date.now()-startTime;
      if(!isVisible()) return;
      console.log('startVGA1: '+(Date.now()-startTime)+' '+res);
      document.getElementById("test-vga-data").text='GPU 33%...';
      setTimeout(function(){startTest(test+1);},100);
    },100);
    return;
  }
  if(test==14){
    document.getElementById("test-type-data").text="Opacity test...";
    setTimeout(function(){
      startTime=Date.now();
      res=startVGA(2);
      mss[3]=Date.now()-startTime;
      if(!isVisible()) return;
      console.log('startVGA2: '+(Date.now()-startTime)+' '+res);
      document.getElementById("test-vga-data").text='GPU 66%...';
      setTimeout(function(){startTest(test+1);},100);
    },100);
    return;
  }
  if(test==15){
    document.getElementById("test-type-data").text="Resize test...";
    setTimeout(function(){
      startTime=Date.now();
      res=startVGA(3);
      mss[3]=Date.now()-startTime;
      if(!isVisible()) return;
      console.log('startVGA3: '+(Date.now()-startTime)+' '+res);
      document.getElementById("test-vga-data").text='GPU: '+(mss[3])+' ms';
      setTimeout(function(){startTest(test+1);},100);
    },100);
    return;
  }
  
  if(test==16){
    document.getElementById("test-type-data").text="Total: "+getTotal('your')+' ms';
    document.getElementById("teststart-button").style.display='inline';
    drawBars();
  }
}
function startInteger(){
  let a=1;
  let b=8;
  for(let j=0 ; j < 1000 ; j++){
    for(let i=0; i< 100 ; i++){
      a=a+i;
      b=b*i;
    }
    //console.log(''+a+' '+b);
  }
  return a+b;
}
function startFloat(){
  let a=0.999999;
  let b=7.999999;
  for(let j=0 ; j < 1000 ; j++){
    for(let i=0; i< 100 ; i++){
      a=a+i;
      b=b*i;
    }
    //console.log(''+a+' '+b);
  }
  return a+b;
}
function startString(){
  let a="abcdefgh";
  let b="bcdfghju";
  for(let j=0 ; j < 1000 ; j++){
    a=a+b+a+b+a+b+a+b+a+b+a+b+a+b+a+b+a+b+a+b+a+b+a+b+a+b+a+b+a+b+a+b+a+b+a+b+a+b+a+b+a+b+a+b+a;
    a=a.substring(4,b.length);
  }
  return a+b;
}
function startBitops(){
  let a=1;
  let b=8;
  for(let j=0 ; j < 1000 ; j++){
    for(let i=0; i< 200 ; i++){
      a=a&i;
      b=b^i;
    }
    //console.log(''+a+' '+b);
  }
  return a<<b;
}
function startArray(){
  let a=[1];
  let b=[2];
  for(let j=0 ; j < 50 ; j++){
    for(let i=0; i< 500 ; i++){
      a[i]=b[j];
      b[i]=a[j];
    }
    //console.log(''+a+' '+b);
  }
  return a.length+b.length;
}
function startRegexp(){
  let regex = new RegExp('^([\w.\'"\[\]]+)(?:\s+)?\((.+)\);?$');
  let regex2 = /^([\w.'"\[\]]+)(?:\s+)?\((.+)\);?$/;
  let test = 'func(a)';
  let a=false;
  for (let i = 0; i < 3000; ++i) {
    a=regex.test(test);
  }
  return ''+a;
}
function startScientific(){
  let arrX = new Float32Array(1000,2000,3000,4000,5000);
  let a=0;
  for (let i = 0; i < 100; ++i) {
    a+=scientific.sum(arrX);
    a+=scientific.mean(arrX);
    a+=scientific.max(arrX);
    a+=scientific.min(arrX);
  }
  return a;
}
function startDate(){
  let a=0;
  for (let i = 0; i < 300; ++i) {
    a+=(new Date()).getYear();
    a-=(new Date(2020)).getYear();
  }
  return a;
}
function startFS(type){
  const listDir = fs.listDirSync("/private/data");
  let a="";
  if(type == 1){ //file system
    for (let i = 0; i < 100; ++i) {
      let dirIter;
      while((dirIter = listDir.next()) && !dirIter.done) {
        a+=dirIter.value;
      }
    }
  }
  if(type == 2){ //file read
    for (let i = 0; i < 100; ++i) {
      if (fs.existsSync("/mnt/assets/resources/images/test.jpg")) a=fs.readFileSync("/mnt/assets/resources/images/test.jpg", "ascii")+i;
    }
  }
  if(type == 3){ //file write
    for (let i = 0; i < 100; ++i) {
      fs.writeFileSync("/private/data/a.txt",fs.readFileSync("/mnt/assets/resources/images/test.jpg", "ascii"), "ascii");
      if (fs.existsSync("/private/data/a.txt")) fs.unlinkSync("/private/data/a.txt");
    }
  }    
  return a.substring(10);
}
function startJpeg(){
  for (let i = 0; i < 3; ++i) {
    jpeg.decodeSync("/mnt/assets/resources/images/test.jpg", "/private/data/a.txi", {'delete':false,'overwrite':true});
    if (fs.existsSync("/private/data/a.txi")) fs.unlinkSync("/private/data/a.txi");
  }
  
  return "Success";
}
function startVGA(type){
  let from=0;
  if(!type){
    type=0;
    from=10;
  }
  //if(type == 2) from=5;
  if(type == 3) from=8;
  for (let i=from ; i <= 10 ; i++) for(let sor=0 ; sor < 5 ; sor++) for(let oszlop=0 ; oszlop < 5 ; oszlop++ ){
    //i=10;
    let id="tr"+(sor*5+oszlop);
    document.getElementById(id).style.display='inline';
    if(type == 1){ //colorize
      //i=10;
      document.getElementById(id).style.fill=getRandomColor();
    }
    if(type == 2 || type == 0){
      //i=10;
      document.getElementById(id).style.opacity=(i)/20;
    }
    if(type == 3 || type == 0){
      let width=device.screen.width*(i/50);
      let height=device.screen.height*(i/50);
      let x=oszlop*width;
      let y=device.screen.height*0+sor*height;
      //console.log("id: "+id+", x: "+x+", y: "+y+", w: "+width+", h: "+height);
      document.getElementById(id).x=x;
      document.getElementById(id).y=y;
      document.getElementById(id).height=height;
      document.getElementById(id).width=width;
      for(let i=0 ; i < 25 ; i++) document.getElementById("tr"+i).style.display='none';
    }
  }
  
  return "Success";
}
function getRandomColor() {
  var letters1 = '0123456789ABCDEF'.split('');
  var letters2 = '23456789ABCDEF'.split('');
  //var letters2 = 'BCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    if (i%2) color += letters1[Math.floor(Math.random() * letters1.length)];
    else color += letters2[Math.floor(Math.random() * letters2.length)];
  }
  return color;
}
function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}
function drawBars(){
  
  let totalMax=getMaxTotal();
  //BARFULLWIDTH
  let sortable = [];
  sortable.push(['ionic', getTotal('ionic')]);
  sortable.push(['versa', getTotal('versa')]);
  sortable.push(['versa2', getTotal('versa2')]);
  sortable.push(['sense', getTotal('sense')]);
  sortable.push(['your', getTotal('your')]);
  sortable.sort(function(a, b) {
    return a[1] - b[1];
  });
  for(let i=1 ; i <= 5 ; i++){
    let id=sortable[i-1][0];
    document.getElementById("test-comparison-devicename-"+i).text=NAMES[id];
    let results=(id in RESULTS)?RESULTS[id]:mss;
    //let mstext=
    
    
    document.getElementById("test-comparison-ms-"+i).style.fontSize=25;
    if(getTotal(id)>0){
      if(!detailedRows[i-1]){
        document.getElementById("test-comparison-ms-"+i).text=getTotal(id)+' ms';
      }
      else{
        document.getElementById("test-comparison-ms-"+i).style.fontSize=20;
        document.getElementById("test-comparison-ms-"+i).text=results.join(',')+' ms';
      }
      
    }
    else {
      document.getElementById("test-comparison-ms-"+i).text='Start the test first';
    }
    for(let j=1 ; j <= results.length ; j++){
      document.getElementById("test-bar-"+j+"-"+i).width=getBarWidth(results[j-1],totalMax);
    }
  }
}
function getBarWidth(ms,totalMax){
  return (ms/totalMax)*300;
}
function getMaxTotal(){
  return Math.max(getTotal('ionic'),getTotal('versa'),getTotal('versa2'),getTotal('sense'),getTotal('your'));
}
function getTotal(id){
  let sum=0;
  let from=mss;
  if(id in RESULTS) from=RESULTS[id];
  for(let i=0 ; i < from.length ; i++) sum+=from[i];
  return sum;
}

