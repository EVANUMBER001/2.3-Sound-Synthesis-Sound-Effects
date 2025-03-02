// Setup canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load dive image
const diveImage = new Image();
diveImage.src = "dive.png";  // Ensure file name is correct

// Function to display dive image
function showEvent() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    ctx.drawImage(diveImage, 100, 50, 300, 200);  // Display image
}

// Create splash sound effect
function playSplashSound() {
    // Water splash effect using noise
    const splash = new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.01, decay: 0.5, sustain: 0 }
    });

    // Add a low-pass filter to shape sound
    const filter = new Tone.Filter(1000, "lowpass").toDestination();
    splash.connect(filter);

    // Simulate depth with a bass hit
    const bass = new Tone.MembraneSynth({
        pitchDecay: 0.2,
        octaves: 1.5,
        envelope: { attack: 0.02, decay: 0.6, sustain: 0 }
    }).toDestination();

    // Add reverb for water effect
    const reverb = new Tone.Reverb({ decay: 2, wet: 0.7 }).toDestination();
    splash.connect(reverb);
    bass.connect(reverb);

    // Add an LFO to modulate splash frequency
    const lfo = new Tone.LFO(3, 400, 1200).start();
    lfo.connect(filter.frequency);

    // Play sound
    splash.triggerAttackRelease("8n");
    bass.triggerAttackRelease("G1", "8n");
}

// Canvas click event: Show image & play sound
canvas.addEventListener("click", () => {
    showEvent();
    playSplashSound();
});
