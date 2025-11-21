import NaturelinkParser from './naturelink-parser.js';

export function parseNL(rawHex) {
  return new NaturelinkParser(rawHex).parse();
}
