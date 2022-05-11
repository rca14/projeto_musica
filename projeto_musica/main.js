const model_url = "https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/";
const sleep = time => new Promise(resolve => setTimeout(resolve, time));
const fases = ["beforeAll", "preparação", "escutando", "fim"];

const notasReferencia = {
    'E1': { frequencia: 41.203, posicoes: [{ corda: 6, casa: 0 }] },
    'F1': { frequencia: 43.654, posicoes: [{ corda: 6, casa: 1 }] },
    'F#1': { frequencia: 46.249, posicoes: [{ corda: 6, casa: 2 }] },
    'G1': { frequencia: 48.999, posicoes: [{ corda: 6, casa: 3 }] },
    'G#1': { frequencia: 51.913, posicoes: [{ corda: 6, casa: 4 }] },
    'A1': { frequencia: 55.000, posicoes: [{ corda: 6, casa: 5 }, { corda: 5, casa: 0 }] },
    'A#1': { frequencia: 58.270, posicoes: [{ corda: 6, casa: 6 }, { corda: 5, casa: 1 }] },
    'B1': { frequencia: 61.735, posicoes: [{ corda: 6, casa: 7 }, { corda: 5, casa: 2 }] },
    'C2': { frequencia: 65.406, posicoes: [{ corda: 6, casa: 8 }, { corda: 5, casa: 3 }] },
    'C#2': { frequencia: 69.296, posicoes: [{ corda: 6, casa: 9 }, { corda: 5, casa: 4 }] },
    'D2': { frequencia: 73.416, posicoes: [{ corda: 6, casa: 10 }, { corda: 5, casa: 5 }, { corda: 4, casa: 0 }] },
    'D#2': { frequencia: 77.782, posicoes: [{ corda: 6, casa: 11 }, { corda: 5, casa: 6 }, { corda: 4, casa: 1 }] },
    'E2': { frequencia: 82.407, posicoes: [{ corda: 6, casa: 12 }, { corda: 5, casa: 7 }, { corda: 4, casa: 2 }] },
    'F2': { frequencia: 87.307, posicoes: [{ corda: 6, casa: 13 }, { corda: 5, casa: 8 }, { corda: 4, casa: 3 }] },
    'F#2': { frequencia: 92.499, posicoes: [{ corda: 6, casa: 14 }, { corda: 5, casa: 9 }, { corda: 4, casa: 4 }] },
    'G2': { frequencia: 97.999, posicoes: [{ corda: 6, casa: 15 }, { corda: 5, casa: 10 }, { corda: 4, casa: 5 }, { corda: 3, casa: 0 }] },
    'G#2': { frequencia: 103.826, posicoes: [{ corda: 6, casa: 16 }, { corda: 5, casa: 11 }, { corda: 4, casa: 6 }, { corda: 3, casa: 1 }] },
    'A2': { frequencia: 110.000, posicoes: [{ corda: 6, casa: 17 }, { corda: 5, casa: 12 }, { corda: 4, casa: 7 }, { corda: 3, casa: 2 }] },
    'A#2': { frequencia: 116.541, posicoes: [{ corda: 6, casa: 18 }, { corda: 5, casa: 13 }, { corda: 4, casa: 8 }, { corda: 3, casa: 3 }] },
    'B2': { frequencia: 123.471, posicoes: [{ corda: 6, casa: 19 }, { corda: 5, casa: 14 }, { corda: 4, casa: 9 }, { corda: 3, casa: 4 }, { corda: 2, casa: 0 }] },
    'C3': { frequencia: 130.813, posicoes: [{ corda: 6, casa: 20 }, { corda: 5, casa: 15 }, { corda: 4, casa: 10 }, { corda: 3, casa: 5 }, { corda: 2, casa: 1 }] },
    'C#3': { frequencia: 138.591, posicoes: [{ corda: 5, casa: 16 }, { corda: 4, casa: 11 }, { corda: 3, casa: 6 }, { corda: 2, casa: 2 }] },
    'D3': { frequencia: 146.832, posicoes: [{ corda: 5, casa: 17 }, { corda: 4, casa: 12 }, { corda: 3, casa: 7 }, { corda: 2, casa: 3 }] },
    'D#3': { frequencia: 155.563, posicoes: [{ corda: 5, casa: 18 }, { corda: 4, casa: 13 }, { corda: 3, casa: 8 }, { corda: 2, casa: 4 }] },
    'E3': { frequencia: 164.814, posicoes: [{ corda: 5, casa: 19 }, { corda: 4, casa: 14 }, { corda: 3, casa: 9 }, { corda: 2, casa: 5 }, { corda: 1, casa: 0 }] },
    'F3': { frequencia: 174.614, posicoes: [{ corda: 5, casa: 20 }, { corda: 4, casa: 15 }, { corda: 3, casa: 10 }, { corda: 2, casa: 6 }, { corda: 1, casa: 1 }] },
    'F#3': { frequencia: 184.997, posicoes: [{ corda: 4, casa: 16 }, { corda: 3, casa: 11 }, { corda: 2, casa: 7 }, { corda: 1, casa: 2 }] },
    'G3': { frequencia: 195.998, posicoes: [{ corda: 4, casa: 17 }, { corda: 3, casa: 12 }, { corda: 2, casa: 8 }, { corda: 1, casa: 3 }] },
    'G#3': { frequencia: 207.652, posicoes: [{ corda: 4, casa: 18 }, { corda: 3, casa: 13 }, { corda: 2, casa: 9 }, { corda: 1, casa: 4 }] },
    'A3': { frequencia: 220.000, posicoes: [{ corda: 4, casa: 19 }, { corda: 3, casa: 14 }, { corda: 2, casa: 10 }, { corda: 1, casa: 5 }] },
    'A#3': { frequencia: 233.082, posicoes: [{ corda: 4, casa: 20 }, { corda: 3, casa: 15 }, { corda: 2, casa: 11 }, { corda: 1, casa: 6 }] },
    'B3': { frequencia: 246.942, posicoes: [{ corda: 3, casa: 16 }, { corda: 2, casa: 12 }, { corda: 1, casa: 7 }] },
    'C4': { frequencia: 261.626, posicoes: [{ corda: 3, casa: 17 }, { corda: 2, casa: 13 }, { corda: 1, casa: 8 }] },
    'C#4': { frequencia: 277.183, posicoes: [{ corda: 3, casa: 18 }, { corda: 2, casa: 14 }, { corda: 1, casa: 9 }] },
    'D4': { frequencia: 293.665, posicoes: [{ corda: 3, casa: 19 }, { corda: 2, casa: 15 }, { corda: 1, casa: 10 }] },
    'D#4': { frequencia: 311.127, posicoes: [{ corda: 3, casa: 20 }, { corda: 2, casa: 16 }, { corda: 1, casa: 11 }] },
    'E4': { frequencia: 329.628, posicoes: [{ corda: 2, casa: 17 }, { corda: 1, casa: 12 }] },
    'F4': { frequencia: 349.228, posicoes: [{ corda: 2, casa: 18 }, { corda: 1, casa: 13 }] },
    'F#4': { frequencia: 369.994, posicoes: [{ corda: 2, casa: 19 }, { corda: 1, casa: 14 }] },
    'G4': { frequencia: 391.995, posicoes: [{ corda: 2, casa: 20 }, { corda: 1, casa: 15 }] },
    'G#4': { frequencia: 415.305, posicoes: [{ corda: 1, casa: 16 }] },
    'A4': { frequencia: 440.000, posicoes: [{ corda: 1, casa: 17 }] },
    'A#4': { frequencia: 466.164, posicoes: [{ corda: 1, casa: 18 }] },
    'B4': { frequencia: 493.883, posicoes: [{ corda: 1, casa: 19 }] },
    'C5': { frequencia: 523.251, posicoes: [{ corda: 1, casa: 20 }] }
};

let notas = [
    { nota: 'C3', tempo: 0, duracao: 1000 },
    { nota: 'A2', tempo: 1000, duracao: 1000 },
    { nota: 'A2', tempo: 2000, duracao: 500 },
    { nota: 'C3', tempo: 2500, duracao: 500 },
    { nota: 'D3', tempo: 3000, duracao: 500 },
    { nota: 'G2', tempo: 3500, duracao: 1000 },

    { nota: 'G2', tempo: 4500, duracao: 500 },
    { nota: 'A2', tempo: 5000, duracao: 500 },
    { nota: 'A#2', tempo: 5500, duracao: 1000 },
    { nota: 'F3', tempo: 6500, duracao: 1000 },
    { nota: 'F3', tempo: 7500, duracao: 500 },
    { nota: 'E3', tempo: 8000, duracao: 500 },
    { nota: 'C3', tempo: 8500, duracao: 500 },
    { nota: 'D3', tempo: 9000, duracao: 500 },
    { nota: 'C3', tempo: 9500, duracao: 250 },
    { nota: 'A#2', tempo: 9750, duracao: 250 },
    { nota: 'A2', tempo: 10000, duracao: 250 },

    { nota: 'C3', tempo: 11000, duracao: 500 },
    { nota: 'D3', tempo: 11500, duracao: 500 },
    { nota: 'D3', tempo: 12000, duracao: 1000 },
    { nota: 'D3', tempo: 13000, duracao: 500 },
    { nota: 'G3', tempo: 13500, duracao: 250 },
    { nota: 'F3', tempo: 13750, duracao: 500 },
    { nota: 'E3', tempo: 14250, duracao: 500 },
    { nota: 'F3', tempo: 14750, duracao: 250 },
    { nota: 'D3', tempo: 15000, duracao: 500 },
    { nota: 'C3', tempo: 15500, duracao: 1000 },

    { nota: 'F2', tempo: 16500, duracao: 500 },
    { nota: 'G2', tempo: 17000, duracao: 500 },
    { nota: 'A2', tempo: 18000, duracao: 500 },
    { nota: 'D3', tempo: 18500, duracao: 500 },
    { nota: 'C3', tempo: 19000, duracao: 1000 },
    { nota: 'C3', tempo: 20000, duracao: 500 },
    { nota: 'A#2', tempo: 20500, duracao: 500 },
    { nota: 'A2', tempo: 21000, duracao: 1000 },
    { nota: 'E2', tempo: 22000, duracao: 500 },
    { nota: 'F2', tempo: 22500, duracao: 1000 }
];

let notasConvertidas = notasParaGraficos(notas, notasReferencia);
let bolas = [];
let notaAtual = 0;
let analisando = false;
let correto = false;
let parada = false;
let corBarra = 'gray';
let fase = 0;
let contador = 3;
let tocando = false;
let audioContext;
let mic;
let pitch;
let notaEsperada;
let tempoDelta;
let tempoReferencia;
let MIDI
let comeco = false;

//botões
const start = document.querySelector(".start");
start.addEventListener('click', (e) => {
    console.log('pimba')
    comeco = true;
    redraw();
});

const loadnotas = document.querySelector(".loadnotas");
loadnotas.addEventListener('click', (e) => {
    console.log('oi')
    getNotas();
    notasParaGraficos(notas, notasReferencia);
});

const input = document.querySelector('input[type="file"]');
input.addEventListener('change', (e) => {
  //  blobToNoteSequence(e.target.files[0]).then((seq) => {
  //      document.getElementById('mainPlayer').noteSequence = seq;
   //     document.getElementById('mainVisualizer').noteSequence = seq;
   // }).catch((reason) => {
   //     alert('Failed to load MIDI file.');
   //     console.error(reason);
    //});

  const fd = new FormData();
  e.target.files.forEach((file) => {
    fd.append('file', file, file.name);  
  });
  
  MIDI = fd;

  console.log("enviando")
  sendMIDI();
});

//botões

//Requests
function getNotas(){
    var xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
                //console.log(xhr.responseText);
                notas = JSON.parse(xhr.responseText);
                console.log(notas);
            } else {
                console.error(xhr.statusText);
            }   
        }

    xhr.onerror = function (e) {
        console.error(xhr.statusText);
    };

    xhr.open("GET", "http://localhost:3000/atual", true);
    xhr.send(null);
}

function sendMIDI(){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/atual", true);
    xhr.send(MIDI)
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText);
        }
    }
    //xhr.send(MIDI);
}
//requests


function setup() {
    createCanvas(300, 600);
    frameRate(50);
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
    if (analisando) {
        if (!error && frequency && analisando) {
            if (frequency <= notasReferencia[notaEsperada].frequencia * 1.05 && frequency >= notasReferencia[notaEsperada].frequencia * 0.95) {
                correto = true;
                corBarra = 'green';
                parada = true;
            }
            if (parada) {
                analisando = false;
                if (!correto) {
                    corBarra = 'red';
                    parada = false;
                } else {
                    parada = false;
                }
            }
        }
    }
    if (analisando) {
        pitch.getPitch(gotPitch);
    }
};

function draw() {
    if(comeco == true){
    background('brown');
        if (fases[fase] === "beforeAll") {
            beforeAll();
        } else if (fases[fase] === "preparação") {
            preparacao();
        } else if (fases[fase] === "escutando") {
            desenhaNotas();
        } else if (fases[fase] === "fim") {
            noLoop();
        }
    }
};

function desenhaNotas() {
    linhas();
    barra();
    //if (!tocando && tempoReferencia >= 1100) {
     //   tocaMidi();
    //    tocando = true;
    //}
    if (notaAtual < notasConvertidas.length) {
        if (tempoReferencia >= notasConvertidas[notaAtual].tempo) {
            console.log(notaAtual);
            console.log(notasConvertidas.length);
            let temp = notasConvertidas[notaAtual];
            bolas.push(new bola(temp.x, 25, temp.nota, temp.casa, temp.duracao, 11));
            notaAtual++;
        }
    }
    bolas.forEach((bola, indice, arr) => {
        if (bola.yVirtual < 575) {
            bola.show();
            bola.movimento();
        } else if (bola.yVirtual = 575) {
            bola.show();
            if (analisando && indice > 0) {
                parada = true;
                arr.shift();
                correto = false;
                notaEsperada = bola.nota;
                analisando = true;
                pitch.getPitch(gotPitch);
            } else if (!analisando && indice == 0 && !correto) {
                analisando = true;
                notaEsperada = bola.nota;
                pitch.getPitch(gotPitch);
            }
            bola.movimento();
        } if (bola.yVirtual > 575) {
            parada = true;
            arr.shift();
            correto = false;
            if (notaAtual >= notasConvertidas.length) {
                fase++;
            }
        }
    });
    tempoReferencia = millis() - tempoDelta;
};

class bola {
    constructor(x, y, nota, tex, duracao, speed) {
        this.posX = x;
        this.posY = y;
        this.nota = nota;
        this.texto = tex;
        this.duracao = duracao;
        this.speed = speed;
        this.yVirtual = y;
    }

    movimento() {
        this.posY += this.speed;
        if (this.posY >= 575 && this.posY <= 575 + (this.duracao * 110)) {
            this.yVirtual = 575;
        } else {
            this.yVirtual = this.posY;
        }
    }

    show() {
        fill('gray');
        circle(this.posX, this.yVirtual, 50);
        textSize(40);
        textAlign(CENTER, CENTER);
        fill('black');
        text(this.texto, this.posX, this.yVirtual);
    }
};

async function preparacao() {
    linhas();
    barra();
    await regressiva();
};

async function regressiva() {
    fill("white");
    circle(width / 2, height / 2, 100);
    textSize(80);
    textAlign(CENTER, CENTER);
    fill('black');
    text(contador, width / 2, height / 2);
    await sleep(1000);
    if (contador > 1) {
        contador--;
        redraw();
    } else {
        contador = 3;
        fase++;
        tempoDelta = millis();
        tempoReferencia = millis() - tempoDelta;
        loop();
    }
};

function linhas() {
    strokeWeight(6);
    line(width / 12, 0, width / 12, height);
    strokeWeight(5);
    line(3 * (width / 12), 0, 3 * (width / 12), height);
    strokeWeight(4);
    line(5 * (width / 12), 0, 5 * (width / 12), height);
    strokeWeight(3);
    line(7 * (width / 12), 0, 7 * (width / 12), height);
    strokeWeight(2);
    line(9 * (width / 12), 0, 9 * (width / 12), height);
    strokeWeight(1);
    line(11 * (width / 12), 0, 11 * (width / 12), height);
};

async function beforeAll() {
    comecando();
    await sleep(2000);
    limpando();
    instrucoes();
    await sleep(5000);
    fase++;
    redraw();
};

function barra() {
    fill(corBarra);
    rect(0, 550, width, 50);
};

function instrucoes() {
    fill('white');
    textSize(24);
    text("Toque a nota", width / 2, 2 * height / 5);
    text("quando ela chegar", width / 2, (2 * height / 5) + 24);
    text("à barra abaixo", width / 2, (2 * height / 5) + 48);
    barra();
};

function limpando() {
    fill('brown');
    rect(0, 0, width, height);
};

function comecando() {
    textAlign(CENTER, CENTER);
    textSize(54);
    fill('white');
    text('Começando', width / 2, height / 2);
};

function notasParaGraficos(arrIn, notasRef) {
    let arrOut = notasParaTabs(arrIn, notasRef);
    arrOut = tabsParaGraficos(arrOut);
    return arrOut;
};

function tabsParaGraficos(arrIn) {
    let arrOut = [];
    let temp;
    for (tab in arrIn) {
        temp = arrIn[tab];
        arrOut.push({ nota: temp.nota, casa: temp.casa, x: calculaX(temp.corda), tempo: temp.tempo, duracao: temp.duracao });
    }
    return arrOut;
};

function calculaX(corda) {
    let x;
    switch (corda) {
        case 6:
            x = 300 / 12;
            break;
        case 5:
            x = 3 * (300 / 12);
            break;
        case 4:
            x = 5 * (300 / 12);
            break;
        case 3:
            x = 7 * (300 / 12);
            break;
        case 2:
            x = 9 * (300 / 12);
            break;
        case 1:
            x = 11 * (300 / 12);
    }
    return x;
};

function notasParaTabs(arrIn, notasRef) {
    let arrOut = [];
    let temp;
    let resp;
    for (let i = 0; i < arrIn.length; i++) {
        temp = arrIn[i];
        if (i == 0) {
            resp = menorCasa(notasRef[temp.nota]);
            arrOut.push({ nota: temp.nota, corda: resp.corda, casa: resp.casa, tempo: temp.tempo, duracao: temp.duracao });
        } else {
            resp = melhorCasa(arrOut[i - 1], notasRef[temp.nota]);
            arrOut.push({ nota: temp.nota, corda: resp.corda, casa: resp.casa, tempo: temp.tempo, duracao: temp.duracao });
        }
    }
    return arrOut;
};

function melhorCasa(notaIn, ref) {
    let diferenca = 21;
    let distancia = 7;
    let casa = 21;
    let corda = 7;
    let temp;
    for (combinacao in ref.posicoes) {
        temp = ref.posicoes[combinacao];
        if (Math.abs(temp.casa - notaIn.casa) < diferenca) {
            diferenca = Math.abs(temp.casa - notaIn.casa);
            distancia = Math.abs(temp.corda - notaIn.corda);
            casa = temp.casa;
            corda = temp.corda;
        } else if (Math.abs(temp.casa - notaIn.casa) == diferenca) {
            if (Math.abs(temp.corda - notaIn.corda) < distancia) {
                diferenca = Math.abs(temp.casa - notaIn.casa);
                distancia = Math.abs(temp.corda - notaIn.corda);
                casa = temp.casa;
                corda = temp.corda;
            } else if (Math.abs(temp.corda - notaIn.corda) == distancia) {
                if (temp.casa < casa) {
                    diferenca = Math.abs(temp.casa - notaIn.casa);
                    distancia = Math.abs(temp.corda - notaIn.corda);
                    casa = temp.casa;
                    corda = temp.corda;
                }
            }
        }
    }
    return { corda, casa };
};

function menorCasa(ref) {
    let casa = 21;
    let corda = 7;
    let temp;
    for (combinacao in ref.posicoes) {
        temp = ref.posicoes[combinacao];
        if (temp.casa < casa) {
            casa = temp.casa;
            corda = temp.corda;
        }
    }
    return { corda, casa };
};