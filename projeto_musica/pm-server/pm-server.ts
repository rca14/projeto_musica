import express = require('express');
import bodyParser = require("body-parser");
import { Midi } from '@tonejs/midi';
import fs = require("fs");

var pmserver = express();
var file = fs.readFileSync("./DEMO.mid");
var midi = new Midi(file);
var temp = midi.tracks.filter((trk) => trk.instrument.name === "acoustic guitar (steel)");
var resp = temp[0].notes.map(separaNota)

function separaNota(nota: { name: any; time: any; duration: any; }) {
  var nome = nota.name;
  var tempo = nota.time;
  var duracao = nota.duration;
  return { nome, tempo, duracao }
}

var allowCrossDomain = function (req: any, res: any, next: any) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}
const fileUpload = require('express-fileupload');
const path = require('path');
const multer = require('multer')


let storage = multer.diskStorage({
  destination: function (req:any, file:any, cb:any) {
      cb(null, './');
  },
  filename: function (req:any, file:any, cb:any) {
      cb(null, file.originalname);
  }
});//Configure the place you will upload your file

let upload = multer({ storage: storage });

pmserver.use(allowCrossDomain);
pmserver.use(bodyParser.json());



pmserver.get('/atual', function (req: express.Request, res: express.Response) {
  res.send(JSON.stringify(resp));
})


pmserver.post('/atual',upload.single('file'), function (req, res, next) {
  if (!req.file || Object.keys(req.file).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
    console.log(req.file);
    res.send('File uploaded!');
    
})

pmserver.put('/atual', function (req: express.Request, res: express.Response) {
  if (true) {
    res.send({ "Success": "Arquivo MIDI carregado." });
  } else {
    res.send({ "failure": "Erro ao conver arquivo MIDI." });
  }
})

var server = pmserver.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

function closeServer(): void {
  server.close();
}

export { server, closeServer }