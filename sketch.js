var mic, soundFile;
var fft, amplitude;
var smoothing = 0.9;
var binCount = 1024;
var particles = new Array(binCount);
var qrcode;

function setup() {
  c = createCanvas(window.innerWidth, window.innerHeight);
  noStroke();

  soundFile = loadSound('./media/dreams.mp3');
  mic = new p5.AudioIn();
  console.log(mic.getSources())
  mic.start();
  // mic.amp(0.2);
  // soundFile.amp(0.2);
  fft = new p5.FFT(smoothing, binCount);
  fft.setInput(mic);


  for (var i = 0; i < particles.length; i++) {
    var position = createVector(random(width), random(height+500), i);
    particles[i] = new Particle(position);
  }

  qrcode = loadImage('./media/Seeing_Sound_Demo_small.png')
}

function draw() {
  let energy=[fft.getEnergy("bass"), fft.getEnergy("lowMid"), fft.getEnergy("mid"), fft.getEnergy("highMid"), fft.getEnergy("treble")]
  background(energy[0], energy[1], energy[2], 10);
  var spectrum = fft.analyze(binCount);

  for (var i = 0; i < binCount; i++) {
    particles[i].update(i, spectrum[i]);
    particles[i].draw();
  }

  // QR CODE
  image(qrcode, window.innerWidth-qrcode.width/3, window.innerHeight-qrcode.height/3, qrcode.width/3, qrcode.height/3)

  // DEBUG
  // fill(255)
  // rect(0, 0, 100, 200)
  // for(let i = 0; i<energy.length; i++){
  //   strokeWeight(10)
  //   stroke(0)
  //   point(i*10+20, 175-energy[i])
  // }
}

var Particle = function(position) {
  this.position = position;
  this.speedScale = 1 // how fast particles move
  this.scale = random(0, 0.5); // how big or small particles are
  this.yScale = random(0, 0.5); // more or less vertical movement
  this.color = [random(0, 255), random(0, 255), random(0, 255)];
  this.colorScale = random(0,5);
}

Particle.prototype.update = function(frequency, level) {
  var warm = map(frequency, 0, 1024, 255, 0)
  var cool = map(frequency, 0, 1024, 0, 255)
  if(level*scale > 50){
    this.colorScale = -this.colorScale
  }
  this.color[0] = warm*this.colorScale
  this.color[1] = level*this.colorScale
  this.color[2] = cool*this.colorScale
  if (level * this.scale < 20) {
    this.position.z = 500
  }
  if(this.position.x + this.speed > windowWidth || this.position.x + this.speed < 0){
    this.speedScale = -this.speedScale
  }
  this.speed = map(level, 0, 255, 1, 10)*this.speedScale
  this.position.x = this.position.x + this.speed
  this.position.y = this.position.y - level*this.yScale
  if (!onScreen(this.position)) {
    this.position.x = random(width);
    this.position.y = random(height)
  }
  this.diameter = level * this.scale;
}

Particle.prototype.draw = function() {
  fill(this.color);
  noStroke()
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

function onScreen(v) {
  return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}