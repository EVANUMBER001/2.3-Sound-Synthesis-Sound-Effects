let diveImg;
let showImage = false;
let splashOsc, splashNoise, splashEnv, filter;

function preload() {
  diveImg = loadImage('dive.jpg'); // Make sure dive.jpg is in your project root
}

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255);

  // --- Set up sound stuff ---
  // Envelope for both tone and noise
  splashEnv = new p5.Envelope();
  splashEnv.setADSR(0.01, 0.2, 0.1, 0.4);
  splashEnv.setRange(0.6, 0);

  // Oscillator for tone (FM-like)
  splashOsc = new p5.Oscillator('sine');
  splashOsc.freq(600);
  splashOsc.amp(0);
  splashOsc.start();

  // White noise for splash texture
  splashNoise = new p5.Noise('white');
  splashNoise.amp(0);
  splashNoise.start();

  // Filter to muffle the splash
  filter = new p5.LowPass();
  splashOsc.disconnect();  // Disconnect from master output
  splashNoise.disconnect();
  splashOsc.connect(filter);
  splashNoise.connect(filter);
  filter.connect(); // Send to output
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
  showImage = true;
  playDiveSound();
}

function playDiveSound() {
  // Reset envelope each time
  splashEnv.play(splashOsc);
  splashEnv.play(splashNoise);

  // Frequency drop over time
  let startFreq = 600;
  let endFreq = 100;
  let duration = 500;

  let startTime = millis();

  // Modulate the frequency and filter over time (kinda like an LFO sweep)
  let interval = setInterval(() => {
    let t = millis() - startTime;
    let progress = constrain(t / duration, 0, 1);

    // Linear frequency drop
    let freq = lerp(startFreq, endFreq, progress);
    splashOsc.freq(freq);

    // Modulate filter cutoff like an LFO sweep
    let cutoff = 500 + 1000 * sin(progress * PI);
    filter.freq(cutoff);

    if (progress >= 1) {
      clearInterval(interval);
    }
  }, 16);
}
