var w = window.innerWidth;
var h = window.innerHeight;  

let cap;
function setup() {
  createCanvas(w, h);
  cap = createCapture(VIDEO);
  cap.hide();
  rectMode(CENTER);
  noStroke();
}
function draw() {
  background(50);
  fill(255);
  cap.loadPixels();
  for (let cy = 0; cy < cap.height; cy += 10) {
    for (let cx = 0; cx < cap.width; cx += 5) {
      let offset = ((cy*cap.width)+cx)*4;
      let xpos = (cx / cap.width) * width;
      let ypos = (cy / cap.height) * height;
      rect(xpos, ypos, 10,
        10 * (cap.pixels[offset+1]/255));
    }
  }
}