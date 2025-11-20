import { NaturelinkParser } from './naturelink-parser.js';

export function naturelinkPacket(rawHex) {
  return new NaturelinkParser(rawHex).parse();
}
