import { readInt16LE } from '../helpers/buffer.js';

export function interpretIO(id, valBuf, type) {
  let val;

  if (type === '1byte') val = valBuf.readUInt8(0);
  else if (type === '2byte') val = valBuf.readUInt16LE(0);
  else if (type === '4byte') val = valBuf.readUInt32LE(0);
  else if (type === 'var') val = valBuf;

  switch (id) {
    case 1:
      return { id, label: 'battery_voltage', value: val, dimension: 'V' };
    case 2:
      return { id, label: 'external_voltage', value: val, dimension: 'V' };
    case 3: 
      return { id, label: 'ad1_voltage', value: val, dimension: 'V' };
    case 4: 
      return { id, label: 'ad2_voltage', value: val, dimension: 'V' };
    case 5: 
      return { id, label: 'ad3_voltage', value: val, dimension: 'V' };
    case 6: 
      return { id, label: 'ad4_voltage', value: val, dimension: 'V' };
    case 7: 
      return { id, label: 'ad5_voltage', value: val, dimension: 'V' };
    case 8: 
      return { id, label: 'ad6_voltage', value: val, dimension: 'V' };
    case 9: 
      return { id, label: 'ad7_voltage', value: val, dimension: 'V' };
    case 10: 
      return { id, label: 'ad8_voltage', value: val, dimension: 'V' };
    case 11:
      return { id, label: 'hdop', value: val / 10, dimension: '-' };
    case 12: 
      return { id, label: 'altitude', value: val, dimension: 'm' };
    case 13:
      return { id, label: 'mileage', value: val, dimension: 'm' };
    case 14:
      return { id, label: 'operation_hours', value: val, dimension: 's' };
    case 15: 
      return { id, label: 'input_status_mask', value: val, dimension: '-' };
    case 16: 
      return { id, label: 'output_status_mask', value: val, dimension: '-' };
    case 17:
      return {
        id, label: 'cell_info',
        value: {
          mcc: valBuf.readUInt16LE(0),
          mnc: valBuf.readUInt16LE(2),
          lac: valBuf.readUInt16LE(4),
          cell_id: valBuf.readUInt32LE(6),
        },
        dimension: '-',
      };
    case 18: 
      return { id, label: 'fuel_percentage', value: val / 100.0, dimension: '%' };
    case 19:
      if (type !== 'var' || valBuf.length % 3 !== 0) {
        return {
          id, label: 'temperature_data',
          value: null,
        };
      }
      const temperatures = [];
      let offset = 0;
      const count = valBuf.length / 3;

      for (let i = 0; i < count; i++) {
        const serialNumber = valBuf.readUInt8(offset);
        offset += 1;

        const rawTemp = readInt16LE(valBuf, offset);
        const temperatureC = rawTemp / 100.0;
        offset += 2;

        temperatures.push({
          serial_number: serialNumber,
          temperature_c: temperatureC,
        });
      }
      return { 
        id, label: 'temperature_sensors', 
        value: temperatures, 
        dimension: { 
          serial_number: '-', 
          temperature: '°C',
        },
      };
    case 20: 
      return { id, label: 'geofence_alarm_number', value: val, dimension: '-' };
    case 21:
      return { id, label: 'temp_sensor_alarm_number', value: val, dimension: '-' };
    case 22:
      return { id, label: 'rfid_number', value: val, dimension: '-' };
    case 23:
      return { id, label: 'ibutton_id', value: val, dimension: '-' };
    case 24:
      return {
        id, label: 'acceleration',
        value: {
          x: readInt16LE(valBuf, 0),
          y: readInt16LE(valBuf, 2),
          z: readInt16LE(valBuf, 4),
        },
        dimension: 'mg',
      };
    case 25: {
      if (type !== 'var' || valBuf.length < 10) return null;
      return {
        id, label: 'trip_data',
        value: {
          trip_distance_m: valBuf.readUInt32LE(0),
          trip_time_s: valBuf.readUInt32LE(4),
          max_speed_kmh: valBuf.readUInt16LE(8),
        },
        dimension: { distance: 'm', time: 's', speed: 'km/h' },
      };
    }
    case 26:
      const valueNetwork = (code) => {
        switch (code) {
          case 0: return '2G';
          case 1: return '3G';
          case 2: return '4G';
          case 3: return 'LTE CAT-M1';
          case 4: return 'LTE CAT-NB';
          case 255: return 'Unknown';
          default: return 'Unknown';
        }
      };

      return {
        id,
        label: 'network_type',
        value: valueNetwork(val),
        dimension: '-',
      };
    case 27: {
      if (type !== 'var' || valBuf.length === 0) return null;
      return { id, label: 'device_name', value: valBuf.toString('utf8'), dimension: '-' };
    }
    case 28: {
      if (type !== 'var' || valBuf.length < 6) return null;
      return {
        id, label: 'speed_data',
        value: {
          overspeeding_duration_s: valBuf.readUInt32LE(0),
          overspeeding_max_speed_kmh: valBuf.readUInt16LE(4),
        },
        dimension: { duration: 's', max_speed: 'km/h' },
      };
    }
    case 29: {
      if (type !== 'var' || valBuf.length === 0) return null;
      return { id, label: 'caller_id', value: valBuf.toString('ascii'), dimension: '-' };
    }
    case 30: {
      if (type !== 'var' || valBuf.length < 3) return null;
      const messageType = valBuf.readUInt8(0); 
      const callTimeS = valBuf.readUInt16LE(1);
      const callNumber = valBuf.slice(3).toString('ascii');
      return {
        id, label: 'calling_assistance_message',
        value: {
          message_type: messageType,
          call_time_s: callTimeS,
          call_number: callNumber,
        },
        dimension: { type: '-', time: 's', number: '-' },
      };
    }
    case 31:
      return { id, label: 'entered_geofence_number', value: val, dimension: '-' };
    case 32: {
      if (type !== 'var' || valBuf.length < 8) return null;
      const sensors = [];
      let offset = 0;
      if (offset + 8 <= valBuf.length) {
        const mac = valBuf.slice(offset, offset + 6).toString('hex');
        offset += 6;
        const rssi = valBuf.readInt8(offset++); 
        const flags = valBuf.readUInt8(offset++); 
        sensors.push({ 
          mac, 
          rssi, 
          flags_mask: flags, 
        });
      }
      return { id, label: 'eye_sensor_data', value: sensors, dimension: { rssi: 'dBm', flags: 'Mask' } };
    }
    case 33: {
      if (type !== 'var' || valBuf.length < 8) return null;
      const beacons = [];
      let offset = 0;
      if (offset + 8 <= valBuf.length) {
        const mac = valBuf.slice(offset, offset + 6).toString('hex');
        offset += 6;
        const rssi = valBuf.readInt8(offset++); 
        const frameType = valBuf.readUInt8(offset++); 
        beacons.push({ 
          mac, 
          rssi, 
          frame_type: frameType,
        });
      }
      return { id, label: 'eddystone_beacons', value: beacons, dimension: { rssi: 'dBm', frame_type: '-' } };
    }
    case 34: { 
      if (type !== 'var' || valBuf.length % 5 !== 0) return null;
      const relays = [];
      let offset = 0;
      while (offset + 5 <= valBuf.length) {
        relays.push({
          id: valBuf.readUInt8(offset++),
          rssi: valBuf.readInt8(offset++), 
          hardware_version: valBuf.readUInt8(offset++),
          firmware_version: valBuf.readUInt8(offset++),
          activation_status: valBuf.readUInt8(offset++),
        });
      }
      return { 
        id, label: 'ble_relay_data', 
        value: relays,  
        dimension: { rssi: 'dBm', version: '-', id: '-', status: '-' },
      };
    }
    case 35:
      return { id, label: 'limp_mode_mask', value: val, dimension: '-' };
    case 47: {
      if (type !== '2byte') return null;
      const temp = readInt16LE(valBuf, 0);
      return { id, label: 'mcu_temperature', value: temp / 100.0, dimension: '°C' };
    }
    case 80:
      return { id, label: 'total_fuel', value: val, dimension: 'L' };
    case 81:
      return { id, label: 'trip_fuel_consumption', value: val, dimension: 'L' };
    case 82:
      return { id, label: 'remaining_fuel_percentage', value: val, dimension: '%' };
    case 83: {
      const torque = valBuf.readInt8(0);
      return { id, label: 'engine_torque_percentage', value: torque, dimension: '%' };
    }
    case 84: 
      return { id, label: 'engine_speed', value: val, dimension: 'rpm' };
    case 85:
      return { id, label: 'engine_running_time', value: val / 10.0, dimension: 'h' };
    case 86:
      return { id, label: 'total_vehicle_mileage', value: val, dimension: 'm' };
    case 87:
      return { id, label: 'cruise_control_mask', value: val, dimension: '-' };
    case 88:
      return { id, label: 'tachograph_vehicle_speed', value: val, dimension: 'km/h' };
    case 89: {
      return { id, label: 'engine_intercooler_temp', value: val - 40, dimension: '°C' };
    }
    case 90: {
      const temp = readInt16LE(valBuf, 0);
      return { id, label: 'ambient_air_temperature', value: temp, dimension: '°C' };
    }
    case 91:
      return { id, label: 'engine_fuel_rate', value: val / 20.0, dimension: 'L/h' };
    case 92:
      return { id, label: 'engine_instant_fuel_economy', value: val / 512.0, dimension: 'km/L' };
    case 93:
      return { id, label: 'accurate_total_fuel_consumption', value: val, dimension: 'mL' };
    case 94:
      return { id, label: 'wheel_based_vehicle_speed', value: val, dimension: 'km/h' };
    case 95:
      return { id, label: 'accel_pedal_position_percentage', value: val, dimension: '%' };
    case 96:
      return { id, label: 'engine_load_percentage', value: val, dimension: '%' };
    case 97:
      return { id, label: 'axle_load', value: val / 2.0, dimension: 'kg' };
    case 99:
      return { id, label: 'fms_firmware_version_raw', value: val };
    default:
      return null;
  }
}
