var mic, soundFile;
var fft;
var smoothing = 0.8;
var binCount = 1024;
var particles = new Array(binCount);

function setup() {
  c = createCanvas(windowWidth, windowHeight);
  noStroke();

  //soundFile = createAudio('../../music/Broke_For_Free_-_01_-_As_Colorful_As_Ever.mp3');
  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT(smoothing, binCount);
  fft.setInput(mic);

  for (var i = 0; i < particles.length; i++) {
    var position = createVector(random(width), random(height));
    particles[i] = new Particle(position);
  }
}

function draw() {
  background(0, 0, 0, 100);
  var spectrum = fft.analyze(binCount);

  for (var i = 0; i < binCount; i++) {
    var thisLevel = map(spectrum[i], 0, 255, 0, 1);
    particles[i].update(thisLevel);
    particles[i].draw();
  }
}

var Particle = function(position) {
  this.position = position;
  this.scale = random(0, 1);
  this.speed = random(1,10); //p5.Vector.random2D().mult(random(1, 5));
  this.color = [random(0, 255), random(0, 255), random(0, 255)];
}

Particle.prototype.update = function(someLevel) {
  //this.position.add(this.speed.mult(someLevel));
  // change color 1% of the time
  if (Math.random() < 0.01) {
    // This line executes approximately 10% of the time the function is called
    this.color = [random(0, 255), random(0, 255), random(0, 255)];
  }

  if(this.position.x + this.speed > windowWidth || this.position.x + this.speed < 0){
    this.speed = -this.speed;
  }
  this.position.x = (this.position.x + this.speed);
  //this.position.y = (this.position.y + 5);
  this.diameter = map(someLevel, 0, 1, 0, 100) * this.scale;
}

Particle.prototype.draw = function() {
  fill(this.color);
  ellipse(
    this.position.x, this.position.y,
    this.diameter, this.diameter
  );
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

function keyPressed() {
  if (key == 'T') {
    toggleInput();
  }
}

function toggleInput() {
  if (soundFile.isPlaying()) {
    soundFile.pause();
    mic.start();
    fft.setInput(mic);
  } else {
    soundFile.play();
    mic.stop();
    fft.setInput(soundFile);
  }
}