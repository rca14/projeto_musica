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
pmserver.use(allowCrossDomain);

pmserver.use(bodyParser.json());

pmserver.get('/atual', function (req: express.Request, res: express.Response) {
  res.send(resp);
})

pmserver.post('/atual', function (req: express.Request, res: express.Response) {
  if (true) {
    res.send({ "Success": "Arquivo MIDI carregado." });
  } else {
    res.send({ "failure": "Erro ao conver arquivo MIDI." });
  }
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