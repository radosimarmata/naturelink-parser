export function readInt32LE(buffer, offset) {
  return buffer.readInt32LE(offset);
}

export function readInt16LE(buffer, offset) {
  const val = buffer.readUInt16LE(offset);
  return val & 0x8000 ? val | 0xffff0000 : val;
}

export function hexToBuffer(hex) {
  return Buffer.from(hex, 'hex');
}
