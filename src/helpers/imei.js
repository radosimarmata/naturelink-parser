export function parseIMEI(buffer, offset) {
  let imei = '';
  for (let i = 0; i < 8; i++) {
    const byte = buffer[offset + i];
    const high = (byte >> 4) & 0x0f;
    const low = byte & 0x0f;

    if (i === 0) {
      imei += low.toString();
    } else {
      imei += high.toString() + low.toString();
    }
  }
  return imei;
}
