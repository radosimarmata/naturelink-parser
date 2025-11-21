import { expect } from 'chai';
import { parseNL } from '../src/index.js';

describe('Naturelink Parser', function () {
  it('should correctly parse a valid raw hex packet', function () {
    const rawHex =
      '3e3e01830866344053256207510001013300fbcfb1309e76a0ffb9c25f06af119263011a020801501002ae2f03c3150400000b14000c00000f1f00100000020de12e00000ebb1310000002110afe010a006c04160739071806f700fefeb903b30a';

    const result = parseNL(rawHex);

    // --- Basic structure checks ---
    expect(result).to.be.an('object');
    expect(result).to.have.property('imei');
    expect(result).to.have.property('frameId');
    expect(result).to.have.property('codecId');
    expect(result).to.have.property('records');
    expect(result.records).to.be.an('array');

    // --- Validate at least one record exists ---
    expect(result.records.length).to.be.greaterThan(0);

    const rec = result.records[0];

    // --- Validate required fields ---
    expect(rec).to.have.property('event_id');
    expect(rec).to.have.property('timestamp');
    expect(rec).to.have.property('gps');
    expect(rec.gps).to.have.property('latitude');
    expect(rec.gps).to.have.property('longitude');
    expect(rec.gps).to.have.property('angle');
    expect(rec.gps).to.have.property('speed');
    expect(rec.gps).to.have.property('satellites');

    // Parser tidak error
    expect(result.error).to.be.undefined;
  });
});
