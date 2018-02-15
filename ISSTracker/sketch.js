/*jshint esversion: 6 */

//https://en.wikipedia.org/wiki/Web_Mercator
//https://epsg.io/3857
//http://open-notify.org/Open-Notify-API/ISS-Location-Now/
//http://proj4js.org/
//http://iss.de.astroviewer.net/

var issPos; //iss position in json
var bgImg; //background image
let srcCs; //source coordinate system
let destCs; //desination coordinate system
let center = []; //center of the map
let trans; //transformation object for mapping
let issTail = []; //last few positions of the iss
let tailLength = 20;// length of the tail only for vis purposes
let issHtmlLoc;
let issHtmlLocTime;

function preload() {
  bgImg = loadImage("https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/0,0,1,0,0/1024x512?access_token=pk.eyJ1IjoibWphaG5rZSIsImEiOiJjajAweXVlYzMwMm0yMnhteW93eG04cnY2In0.EBW7Um4edJw7Zpn11-bksg");
  // tex = loadImage("https://api.mapbox.com/styles/v1/mapbox/light-v9/static/0,0,1,0,0/1024x1024?access_token=pk.eyJ1IjoibWphaG5rZSIsImEiOiJjajAweXVlYzMwMm0yMnhteW93eG04cnY2In0.EBW7Um4edJw7Zpn11-bksg", success, failure);
}

function setup() {
  createElement("h1", "ISS Tracker");
  createCanvas(1024, 512);
  translate(width / 2, height / 2);
  imageMode(CENTER);

  frameRate(0.25);

  //setting Coordinate system
  srcCs = proj4.defs('EPSG:4326');
  destCs = proj4.defs('EPSG:3857');
  trans = proj4(srcCs, destCs);

  center = trans.forward([0, 0]);
  // center = proj4(srcCs, destCs, [0, 0]);
  // console.log(center);
  // console.log(trans.inverse([0, 20048966.10]));
  // console.log(trans.forward([0, 85.06]));

  //ISS Information
  let dataDiv = createElement("div").class("issInfo");
  createElement("h3","ISS Position:").parent(dataDiv);
  issHtmlLocTime = createP("").id("issTime").parent(dataDiv);
  issHtmlLoc = createP("").id("lonlat").parent(dataDiv);
  // createP("Latitude").id("lat").parent(dataDiv);
}

function draw() {
  imageMode(CENTER);
  translate(width / 2, height / 2);
  image(bgImg, 0, 0);
  fill(255);
  // ellipse(center[0], center[1], 6, 6);
  // ellipse(150, 50, 6, 6);
  // ellipse(-150, -50, 6, 6);

  loadJSON("http://api.open-notify.org/iss-now.json", gotData);
  if (issPos) {
    let d = issPos.timestamp * 1000;
    // console.log(new Date(d));
    let lon = issPos.iss_position.longitude;
    let lat = issPos.iss_position.latitude;
    // console.log(d);
    // console.log("lon: " + issPos.iss_position.longitude + " lat: " + issPos.iss_position.latitude);
    issHtmlLocTime.html("Date: " + getCurrentDate(new Date(d)) + "&nbsp;&nbspTime: " + getCurrentTime(new Date(d)));
    issHtmlLoc.html("Longitude: " + lon + "°&nbsp;&nbsp;&nbsp;" + "Latitude: " + lat + "°");

    let transPos = trans.forward([lon, lat]);
    let mapCoords = [];
    mapCoords[0] = map(transPos[0], -20037508.342789, 20037508.342789, -512, 512);
    mapCoords[1] = map(transPos[1], 20048966.104014594, -20048966.1040146, -512, 512);

    if (issTail.length < tailLength) {
      issTail.unshift(mapCoords);
    } else {
      issTail.pop();
      issTail.unshift(mapCoords);
    }
    // console.log(issTail.length);
    // console.log(mapCoords[0] + " : " + mapCoords[1]);
    noStroke();
    // fill(255);
    let j = 255/issTail.length;
    for (var i = 0; i < issTail.length; i++) {
      // ellipse(mapCoords[0], mapCoords[1], 6, 6);
      fill(255, (255 - i * j));
      let g = issTail[i];
      ellipse(g[0],g[1], 4, 4);
    }
  }
}//end draw()

function gotData(data) {
  issPos = data;
}

function getCurrentDate(date) {
  var dd = date.getDate();
  var mm = date.getMonth() + 1; //January == 0
  var yyyy = date.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  return dd + "." + mm + "." + yyyy;
}

function getCurrentTime(date) {
  var hh = date.getHours();
  var mm = date.getMinutes();
  var ss = date.getSeconds();
  if (hh < 10) {
    hh = "0" + hh;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  if (ss < 10) {
    ss = "0" + ss;
  }
  return hh + ":" + mm + ":" + ss;
}
