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
    case 3: 
      return { key: 'ad1_voltage', val: val };
    case 4: 
      return { key: 'ad2_voltage', val: val };
    case 5: 
      return { key: 'ad3_voltage', val: val };
    case 6: 
      return { key: 'ad4_voltage', val: val };
    case 7: 
      return { key: 'ad5_voltage', val: val };
    case 8: 
      return { key: 'ad6_voltage', val: val };
    case 9: 
      return { key: 'ad7_voltage', val: val };
    case 10: 
      return { key: 'ad8_voltage', val: val };
    case 11:
      return { key: 'hdop', val: val / 10 };
    case 12: 
      return { key: 'altitude_m', val: val };
    case 13:
      return { key: 'mileage', val };
    case 14:
      return { key: 'operation_hours_s', val };
    case 15: 
      return { key: 'input_status_mask', val: val };
    case 16: 
      return { key: 'output_status_mask', val: val };
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
    case 18: 
      return { key: 'fuel_percentage', val: val / 100.0 };
    case 18: 
      return { key: 'geofence_alarm_number', val: val };
    case 84: 
      return { key: 'engine_speed_rpm', val: val };
    case 24:
      return {
        key: 'acceleration_mg',
        val: {
          x: readInt16LE(valBuf, 0),
          y: readInt16LE(valBuf, 2),
          z: readInt16LE(valBuf, 4),
        },
      };
    case 47: {
      if (type !== '2byte') return null;
      const temp = readInt16LE(valBuf, 0);
      return { 
        key: 'mcu_temperature_c', val: temp / 100.0 
      };
    }

    default:
      return null;
  }
}
