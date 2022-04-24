const model_url = "https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/";
const sleep = time => new Promise(resolve => setTimeout(resolve, time));
const Http = new XMLHttpRequest();
const url = 'http://localhost:3000/atual';
Http.open("GET", url);
Http.send();
Http.onreadystatechange = (e) => {
    console.log(Http.responseText)
}
let notas = [{ nota: "C3", frequencia: 261.64 }, { nota: "D3", frequencia: 293.68 }, { nota: "E3", frequencia: 329.64 },
{ nota: "F3", frequencia: 349.24 }, { nota: "G3", frequencia: 392.00 }, { nota: "A4", frequencia: 440.00 }, { nota: "B4", frequencia: 493.92 }];
let pitch;
let audioContext;
let mic;
let freq = 0;
let posicao = 0;
let correto = false;

function setup() {
    createCanvas(400, 400);
    audioContext = getAudioContext();
    mic = new p5.AudioIn();
    mic.start(listening);
};

function listening() {
    pitch = ml5.pitchDetection(
        model_url,
        audioContext,
        mic.stream,
        modelLoaded
    );
};

function gotPitch(error, frequency) {
    if (!error && frequency) {
        freq = frequency;
        if (freq <= notas[posicao].frequencia + 20 && freq >= notas[posicao].frequencia - 20) {
            correto = true;
        }
    }
    pitch.getPitch(gotPitch);
};

function modelLoaded() {
    pitch.getPitch(gotPitch);
};

async function draw() {
    background(0);
    textAlign(CENTER, CENTER);
    textSize(64);
    if (!correto) {
        fill(255, 0, 0);
        text(notas[posicao].nota, width / 2, height / 2);
    } else {
        fill(0, 255, 0);
        text(notas[posicao].nota + " " + freq.toFixed(2), width / 2, height / 2);
        noLoop();
        await sleep(2000);
        if (posicao < 6) {
            posicao++;
        } else {
            posicao = 0;
        }
        correto = false;
        loop();
    }
};