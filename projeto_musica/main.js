const model_url = "https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/";
const sleep = time => new Promise(resolve => setTimeout(resolve, time));
const fases = ["beforeAll", "preparação", "escutando", "atualizando", "fim"]
const Http = new XMLHttpRequest();
const url = 'http://localhost:3000/atual';
Http.open("GET", url);
Http.send();
Http.onreadystatechange = (e) => {
    console.log(Http.responseText)
}

let notas = [{ nota: "C3", frequencia: 261.64, time: 1000 }, { nota: "D3", frequencia: 293.68, time: 1000 }, { nota: "E3", frequencia: 329.64, time: 1000 },
{ nota: "F3", frequencia: 349.24, time: 1000 }, { nota: "G3", frequencia: 392.00, time: 1000 }, { nota: "A4", frequencia: 440.00, time: 1000 }, { nota: "B4", frequencia: 493.92, time: 1000 }];
let color = "white";
let fase = 0;
let contador = 3;
let pitch;
let audioContext;
let mic;
let freq = 0;
let posicao = 0;
let correto = false;
let controle = false;
let corretas = 0;

let MIDI;

const start = document.getElementById("start");
start.addEventListener('change', (e) => {
    //esperar pra começar até clicar aqui
});

const loadnotas = document.getElementById("loadnotas");
loadnotas.addEventListener('change', (e) => {
    getNotas();
});

const input = document.querySelector('input[type="file"]');
input.addEventListener('change', (e) => {

  const fd = new FormData();
  e.target.files.forEach((file) => {
    fd.append(e.target.name, file, file.name);  
  });
  
  MIDI = fd;

  sendMIDI();
});

function getNotas(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/atual", true);

    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
                notas = JSON.parse(xhr.responseText);
                console.log(notas);
            } else {
                console.error(xhr.statusText);
            }   
        }
    };

    xhr.onerror = function (e) {
        console.error(xhr.statusText);
    };

    xhr.send(null);
}

function sendMIDI(){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/atual", true);

    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText);
        }
    }
    xhr.send(MIDI);
}

function setup() {
    createCanvas(400, 400);
    noLoop();
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

function modelLoaded() {
    pitch.getPitch(gotPitch);
};

function gotPitch(error, frequency) {
    if (!error && frequency) {
        freq = frequency;
        if (freq <= notas[posicao].frequencia + 20 && freq >= notas[posicao].frequencia - 20) {
            correto = true;
            mudaCor(1);
        }
    }
    pitch.getPitch(gotPitch);
};

function trocaNota() {
    posicao = (posicao + 1) % notas.length;
    fase--;
};

async function avalia(t) {
    await sleep(t);
    if (!correto) {
        mudaCor(2);
    }
    await sleep(500);
    fase++;
    controle = false;
    correto = false;
    mudaCor(3);
};

function mudaCor(i) {
    switch (i) {
        case 1:
            color = "green";
            break;
        case 2:
            color = "red";
            break;
        case 3:
            color = "gray";
            break;
        default:
            color = "white";
            break;
    }
};

async function draw() {
    console.log(fases[fase]);
    background(0);
    if (fases[fase] === "beforeAll") {
        textAlign(CENTER, CENTER);
        textSize(64);
        fill("white");
        text("Começando", width / 2, height / 2);
        await sleep(2000);
        fill("black");
        square(0, 0, width);
        fill("white");
        textSize(24);
        text("Toque a nota do circulo maior", width / 2, height / 4);
        circle(width / 4, height / 2, 80);
        circle(width / 2, height / 2, 60);
        circle((3 * width) / 4, height / 2, 40);
        await sleep(5000);
        fase++;
        redraw();
    } else if (fases[fase] === "preparação") {
        textSize(64);
        fill("white");
        circle(width / 4, height / 2, 80);
        circle(width / 2, height / 2, 60);
        circle((3 * width) / 4, height / 2, 40);
        mudaCor(3);
        fill(color);
        text(contador, width / 4, height / 2);
        textSize(44);
        text(notas[posicao].nota, width / 2, height / 2);
        textSize(24);
        text(notas[posicao + 1].nota, (3 * width) / 4, height / 2);
        await sleep(1000);
        if (contador > 1) {
            contador--;
        } else {
            contador = 3;
            fase++;
        }
        redraw();
    } else if (fases[fase] === "escutando") {
        fill("white");
        circle(width / 4, height / 2, 80);
        circle(width / 2, height / 2, 60);
        circle((3 * width) / 4, height / 2, 40);
        fill(color);
        textSize(64);
        text(notas[posicao].nota, width / 4, height / 2);
        fill("gray");
        textSize(44);
        text(notas[(posicao + 1) % notas.length].nota, width / 2, height / 2);
        textSize(24);
        text(notas[(posicao + 2) % notas.length].nota, (3 * width) / 4, height / 2);
        if (!controle) {
            avalia(notas[posicao].time);
            controle = true;
            loop();
        }
    } else if (fases[fase] === "atualizando") {
        trocaNota();
        redraw();
    }
    else {
        textSize(64);
        text("Você acertou:")
        text(corretas + "/" + notas.length)
    }
};

let tt = [false, true];
function teste() {
    mudaCor();
};
window.addEventListener('click', teste, false);