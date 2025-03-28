// Import all block definitions
import './chassis.js';
import './gimbal.js';
import './led.js';
import './camera.js';
import './blaster.js';
import './sensors.js';

// Define the toolbox
const toolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Chassis',
      colour: 230,
      contents: [
        { kind: 'block', type: 'chassis_move' },
        { kind: 'block', type: 'chassis_stop' },
        { kind: 'block', type: 'chassis_set_speed' }
      ]
    },
    {
      kind: 'category',
      name: 'Gimbal',
      colour: 290,
      contents: [
        { kind: 'block', type: 'gimbal_move' },
        { kind: 'block', type: 'gimbal_stop' },
        { kind: 'block', type: 'gimbal_set_speed' },
        { kind: 'block', type: 'gimbal_move_to' }
      ]
    },
    {
      kind: 'category',
      name: 'LED',
      colour: 160,
      contents: [
        { kind: 'block', type: 'led_set_color' },
        { kind: 'block', type: 'led_effect' }
      ]
    },
    {
      kind: 'category',
      name: 'Camera',
      colour: 120,
      contents: [
        { kind: 'block', type: 'camera_start' },
        { kind: 'block', type: 'camera_stop' },
        { kind: 'block', type: 'camera_read' },
        { kind: 'block', type: 'camera_set_resolution' }
      ]
    },
    {
      kind: 'category',
      name: 'Blaster',
      colour: 200,
      contents: [
        { kind: 'block', type: 'blaster_fire' },
        { kind: 'block', type: 'blaster_stop' },
        { kind: 'block', type: 'blaster_set_power' }
      ]
    },
    {
      kind: 'category',
      name: 'Sensors',
      colour: 60,
      contents: [
        { kind: 'block', type: 'battery_level' },
        { kind: 'block', type: 'battery_voltage' },
        { kind: 'block', type: 'armor_hit' },
        { kind: 'block', type: 'sensor_distance' }
      ]
    }
  ]
};

// Export the toolbox
export { toolbox }; 