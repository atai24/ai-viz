var w = window.innerWidth;
var h = window.innerHeight; 

let cap;
function setup() {
  createCanvas(w, h);
  cap = createCapture(VIDEO);
  cap.hide();
  noStroke();
  fill(0);
}
let time = 0;
function draw() {
  background(255);
  cap.loadPixels();
  // Use sin() to create a pulsating effect for stepSize between 6 and 10
  const stepSize = round(map(sin(time), -1, 1, 6, 10));
  // Calculate scale factors using the updated variables
  const scaleX = w / cap.width;
  const scaleY = h / cap.height;
  for (let y = 0; y < cap.height; y += stepSize) {
    for (let x = 0; x < cap.width; x += stepSize) {
      const i = (y * cap.width + x) * 4;
      // Generate a random color within reason by slightly altering the original color
      const r = cap.pixels[i] + random(-20, 20);
      const g = cap.pixels[i + 1] + random(-20, 20);
      const b = cap.pixels[i + 2] + random(-20, 20);
      fill(r, g, b);
      // Generate a random radius for the ellipse within a reasonable range
      const radius = random(stepSize * 0.5, stepSize * 1.5);
      // Scale the drawing positions and size to fill the screen using the updated variables
      ellipse(x * scaleX, y * scaleY, radius * scaleX, radius * scaleY);
    }
  }
}