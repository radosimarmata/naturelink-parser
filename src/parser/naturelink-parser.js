import { parseIMEI } from '../helpers/imei.js';
import { interpretIO } from '../io/interpret-io.js';
import { EVENT_MAP } from '../helpers/event-map.js';

export class NaturelinkParser {
  constructor(rawHex) {
    this.buffer = Buffer.from(rawHex, 'hex');
    this.offset = 0;
  }

  read(size) {
    const buf = this.buffer.slice(this.offset, this.offset + size);
    this.offset += size;
    return buf;
  }

  readUInt8() {
    return this.buffer.readUInt8(this.offset++);
  }
  readUInt16() {
    const v = this.buffer.readUInt16LE(this.offset);
    this.offset += 2;
    return v;
  }
  readInt32() {
    const v = this.buffer.readInt32LE(this.offset);
    this.offset += 4;
    return v;
  }

  parse() {
    const b = this.buffer;
    this.offset += 2; // skip header

    const version = this.readUInt8();
    const frameId = this.readUInt8();
    const imei = parseIMEI(b, this.offset);
    this.offset += 8;

    const dataLength = this.readUInt16();
    const codecId = this.readUInt8();
    const recordCount = this.readUInt8();

    const BASE_EPOCH_MS = Date.UTC(2000, 0, 1);
    const records = [];

    for (let i = 0; i < recordCount; i++) {
      const eventId = this.readUInt16();
      const ts = this.readInt32();
      const timestamp = new Date(BASE_EPOCH_MS + ts * 1000);

      const lat = this.readInt32() / 1e6;
      const lng = this.readInt32() / 1e6;

      const status = this.readUInt16();
      const valid = (status & 1) === 1;
      const speed = (status >> 6) & 0x03ff;

      const satAngle = this.readUInt16();
      const satellites = satAngle & 0x7f;
      const heading = (satAngle >> 7) & 0x1ff;

      let io = [];
      this.readIOBlock(1, io);
      this.readIOBlock(2, io);
      this.readIOBlock(4, io);
      this.readIOBlock(8, io);
      this.readVarIO(io);

      records.push({
        priority: i + 1,
        timestamp,
        gps: {
          latitude: lat,
          longitude: lng,
          speed: speed,
          angle: i === 0 ? heading : undefined,
          satellites: i === 0 ? satellites : undefined,
          valid: i === 0 ? valid : undefined,
        },
        event_id: eventId,
        event_desc: EVENT_MAP[eventId] || `Unknown (${eventId})`,
        version,
        data_length: dataLength,
        io,
      });
    }

    return { imei, frameId, codecId, recordCount, records };
  }

  readIOBlock(byteSize, output) {
    const count = this.readUInt8();
    for (let i = 0; i < count; i++) {
      const id = this.readUInt8();
      const valBuf = this.read(byteSize);
      const entry = interpretIO(id, valBuf, `${byteSize}byte`);
      if (entry) {
        output.push(entry);
      } else {
        output.push({
          id,
          label: '-',
          val: valBuf.toString('hex'),
          dimension: '-',
        });
      }
    }
  }

  readVarIO(output) {
    const varCount = this.readUInt8();
    for (let i = 0; i < varCount; i++) {
      const id = this.readUInt8();
      const size = this.readUInt8();
      const valBuf = this.read(size);
      const entry = interpretIO(id, valBuf, 'var');
      if (entry) {
        output.push(entry);
      } else {
        output.push({
          id,
          label: '-',
          val: valBuf.toString('hex'),
          dimension: '-',
        });
      }
    }
  }
}
