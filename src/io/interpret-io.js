import { readInt16LE } from '../helpers/buffer.js';

export function interpretIO(id, valBuf, type) {
  let val;

  if (type === '1byte') val = valBuf.readUInt8(0);
  else if (type === '2byte') val = valBuf.readUInt16LE(0);
  else if (type === '4byte') val = valBuf.readUInt32LE(0);
  else if (type === 'var') val = valBuf;

  switch (id) {
    case 26:
      return { key: 'network_type', val };

    case 1:
      return { key: 'battery_voltage', val };
    case 2:
      return { key: 'external_voltage', val };
    case 11:
      return { key: 'hdop', val: val / 10 };

    case 13:
      return { key: 'mileage', val };
    case 14:
      return { key: 'operation_hours_s', val };

    case 17:
      return {
        key: 'cell_info',
        val: {
          mcc: valBuf.readUInt16LE(0),
          mnc: valBuf.readUInt16LE(2),
          lac: valBuf.readUInt16LE(4),
          cell_id: valBuf.readUInt32LE(6),
        },
      };

    case 24:
      return {
        key: 'acceleration_mg',
        val: {
          x: readInt16LE(valBuf, 0),
          y: readInt16LE(valBuf, 2),
          z: readInt16LE(valBuf, 4),
        },
      };

    default:
      return null;
  }
}
