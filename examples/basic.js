import { naturelinkPacket } from '../src/parser/index.js';

const rawHex =
  '3e3e01830866344053256207510001013300fbcfb1309e76a0ffb9c25f06af119263011a020801501002ae2f03c3150400000b14000c00000f1f00100000020de12e00000ebb1310000002110afe010a006c04160739071806f700fefeb903b30a';

const result = naturelinkPacket(rawHex);

console.log('=== Naturelink Parsed Data ===');
console.log(JSON.stringify(result, null, 2));
