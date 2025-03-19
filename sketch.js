let diveImg;
let showImage = false;
let splashNoise, splashEnv, filter, dripOsc, dripEnv, reverb;

function preload() {
  diveImg = loadImage('dive.jpg');
}

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255);

  // Splash noise (main texture)
  splashNoise = new p5.Noise('white');
  splashNoise.amp(0);
  splashNoise.start();

  // Filter to shape the splash
  filter = new p5.LowPass();
  splashNoise.disconnect();
  splashNoise.connect(filter);
  filter.connect();

  // Envelope for splash noise (longer and louder)
  splashEnv = new p5.Envelope();
  splashEnv.setADSR(0.01, 0.5, 0.3, 1.2); // Slower release
  splashEnv.setRange(1, 0);

  // Drip oscillator = body hit / deep splash base
  dripOsc = new p5.Oscillator('sine');
  dripOsc.freq(80);
  dripOsc.amp(0);
  dripOsc.start();

  // Envelope for drip
  dripEnv = new p5.Envelope();
  dripEnv.setADSR(0.01, 0.3, 0, 0.8);
  dripEnv.setRange(0.5, 0);

  // Reverb to make it echo like a pool
  reverb = new p5.Reverb();
  reverb.process(filter, 3, 2); // (input, reverbTime, decayRate)
  reverb.process(dripOsc, 3, 2);
}

function draw() {
  background(30);

  if (showImage) {
    image(diveImg, 0, 0, width, height);
  } else {
    text('Click to dive!', width / 2, height / 2);
  }
}

function mousePressed() {
  userStartAudio(); // 🧠 Unlock the browser's audio context
  showImage = true;
  playSplashSound();
}

function playSplashSound() {
  // Trigger the long splash
  splashEnv.play(splashNoise);

  // Sweeping the filter down over time
  let duration = 1000;
  let startTime = millis();

  let interval = setInterval(() => {
    let t = millis() - startTime;
    let progress = constrain(t / duration, 0, 1);
    let cutoff = lerp(2000, 400, progress); // starts bright, fades to underwater
    filter.freq(cutoff);

    if (progress >= 1) clearInterval(interval);
  }, 20);

  // Trigger the deep bloop (underwater boom)
  dripOsc.freq(random(70, 100));
  dripEnv.play(dripOsc);
}
