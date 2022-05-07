const model_url = "https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/";
const sleep = time => new Promise(resolve => setTimeout(resolve, time));
const fases = ["beforeAll", "preparação", "escutando", "atualizando", "fim"]
//const Http = new XMLHttpRequest();
//const url = 'http://localhost:3000/atual';
//Http.open("GET", url);
//Http.send();
//Http.onreadystatechange = (e) => {
//    console.log(Http.responseText)
//}

let notas = [];
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
let comeco = false;

let MIDI;

//botoes
const start = document.querySelector(".start");
start.addEventListener('click', (e) => {
    for(i=0;i<notas.length;i++){
        notas2.push(notas[i].nome);
        tempodenotas.push(notas[i].tempo);
        //console.log(notas2);
        //console.log(tempodenotas);
    }
    comeco = true;
});

const loadnotas = document.querySelector(".loadnotas");
loadnotas.addEventListener('click', (e) => {
    console.log('oi')
    getNotas();
});

const input = document.querySelector('input[type="file"]');
input.addEventListener('change', (e) => {

  const fd = new FormData();
  e.target.files.forEach((file) => {
    fd.append('file', file, file.name);  
  });
  
  MIDI = fd;

  console.log("enviando")
  sendMIDI();
});
//botoes

//Requests
function getNotas(){
    var xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
                //console.log(xhr.responseText);
                notas = JSON.parse(xhr.responseText);
                //console.log(notas);
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
//Requests

//P5
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

//function trocaNota() {
//   posicao = (posicao + 1) % notas.length;
//    fase--;
//};

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

class bola{
  constructor(x,y,tex,speed){
    this.pos = x;
    this.posy = y;
    this.texto = tex;
    this.speed = speed;
  }
  
  movimento(){
    this.posy = this.posy + this.speed;
  }
  
  show(){
    ellipse(this.pos, this.posy, 20, 20)
    textSize(16);
    text(this.texto, (this.pos-5), (this.posy+5))
  }
}

var bolas = [];
var posicoes =[];
var tempodenotas = [];
var notas2 = [];
var lastPrint;
var laspos;

function randomint(){
  var temp = Math.floor(Math.random() * (2 - 0 + 1) + 0);
  if(temp == laspos){
        temp = Math.floor(Math.random() * (2 - 0 + 1) + 0);
     }
  laspos = temp;
  return temp;
}

function setup() {
    createCanvas(120, 600);
    frameRate(60);
    posicoes = [25,60,95];
    audioContext = getAudioContext();
    mic = new p5.AudioIn();
    mic.start(listening);
}

function draw() {
  if (comeco == true){
    timer= millis();
    if((timer/1000)>=tempodenotas[0]){
        tempodenotas.shift();
        bolas.push(new bola(posicoes[randomint()],0,notas2.shift(),1));
    }
    background(0);
    bolas.forEach(function(bola){
        bola.movimento();
        bola.show();
    });
    line(0,height-75,width,height-75)
    stroke(255)
    line(0,height-50,width,height-50)
    stroke(255)
    }
}

//let tt = [false, true];
//function teste() {
//    mudaCor();
//};
//window.addEventListener('click', teste, false);

//P5