/*jshint esversion: 6 */
//3d webgl primitives for p5.Vector
//https://gist.github.com/simon-tiger/06e865e3012e854e555c0c97757c74d5

//source: https://www.youtube.com/watch?v=dbs4IYGfAXc&t=1273s

//earthquakes data: https://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php

// https://vvvv.org/blog/polar-spherical-and-geographic-coordinates#geographic-coordinates

//aligning the data to the backrounsimage
//https://github.com/tadimon/Rainbow-Code/blob/master/challenges/CC_58_EarthQuakeViz3D/earth.pde

//melbourne: -37.814, 144.96332

let angle = 0;
let tex;
let sphereRadius = 100;
let lat = -37.814;
let lon = 144.96332;
let earthquakes;
let earth;

function preload() {
  //put preload code here
  earth = loadImage("data/earth.jpg", success, failure);
  // tex = loadImage("https://api.mapbox.com/styles/v1/mapbox/light-v9/static/0,0,1,0,0/1024x1024?access_token=pk.eyJ1IjoibWphaG5rZSIsImEiOiJjajAweXVlYzMwMm0yMnhteW93eG04cnY2In0.EBW7Um4edJw7Zpn11-bksg", success, failure);
  // let pathEarthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv";
  let pathEarthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.csv";
  earthquakes = loadTable(pathEarthquakes, "csv", "header", loadEarthquakes);
}

function setup() {
  createElement("h1", "Rotating Globe");
  createCanvas(500, 500, WEBGL);
}

function draw() {
  background(220);

  var locX = mouseX - width / 2;
  var locY = mouseY - height / 2;

  ambientLight(255);
  rotateY(angle + 0.3);
  noStroke();
  // texture(tex);
  texture(earth);
  sphere(sphereRadius);

  angle += 0.01;

  normalMaterial();
  // forEach: https://wiki.selfhtml.org/wiki/JavaScript/Objekte/Array/forEach
  let rows = earthquakes.getRows();

  rows.forEach(function(s, i, o) {
    let lat = s.get("latitude");
    let lon = s.get("longitude");
    let mag = s.get("mag");
    let h = pow(10, mag);
    let maxH = pow(10, 7);
    h = map(h, 0, maxH, 10, 50);

    //transform degrees to radians
    let theta = radians(lat); //+ PI / 2;
    let phi = radians(lon); //+ PI;

    //tranform geographic to cartesian coordinates
    // let cx = sphereRadius * sin(theta) * cos(phi);
    // let cy = -sphereRadius * sin(theta) * sin(phi);
    // let cz = sphereRadius * cos(theta);
    //from tadimon/earth.pde
    let alt = sphereRadius + h / 2;
    let cx = alt * cos(theta) * cos(phi);
    let cy = alt * cos(theta) * sin(phi);
    let cz = alt * sin(theta);

    let x = -cx;
    let y = -cz;
    let z = cy;

    let pos = createVector(x, y, z);

    let xAxis = createVector(1, 0, 0);
    let angleB = xAxis.angleBetween(pos);
    let rAxis = xAxis.cross(pos);


    push();
    translate(x, y, z);
    rotate(angleB, rAxis);
    box(h, 5, 5);
    pop();

  });

  // earthquakes.rows.forEach(function(row, index, obj){
  //   console.log(index + ": " + row.get("place"));
  // });

}

function success() {
  console.log("backgroundmap successfully loaded");
}

function failure() {
  console.log("failureloading backgroundmap");
}

function loadEarthquakes() {
  console.log("earthquakes successfully loaded");
}

// function mouseWheel(event) {
//   // console.log(event);
//   if (event.delta > 0) {
//     sphereRadius += 25;
//   } else {
//     if (sphereRadius < 75) {
//       //do nothing
//     } else {
//       sphereRadius -= 25;
//     }
//   }
// }
