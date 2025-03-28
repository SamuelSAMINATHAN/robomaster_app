// Import all Python generators
import './chassis.js';
import './gimbal.js';
import './led.js';
import './camera.js';
import './blaster.js';
import './sensors.js';
import './robotic_arm.js';
import './gripper.js';
import './vision.js';
import './events.js';
import './mon_module.js';
import './robomaster.js';

// Export all Python generators
export {
  // Chassis generators
  'chassis_move',
  'chassis_stop',
  'chassis_set_speed',
  
  // Gimbal generators
  'gimbal_move',
  'gimbal_stop',
  'gimbal_set_speed',
  'gimbal_move_to',
  
  // LED generators
  'led_set_color',
  'led_effect',
  
  // Camera generators
  'camera_start',
  'camera_stop',
  'camera_read',
  'camera_set_resolution',
  
  // Blaster generators
  'blaster_fire',
  'blaster_stop',
  'blaster_set_power',
  
  // Sensors generators
  'battery_level',
  'battery_voltage',
  'armor_hit',
  'sensor_distance',
  
  // Robotic Arm generators
  'robotic_arm_move',
  'robotic_arm_move_joint',
  'robotic_arm_stop',
  'robotic_arm_get_position',
  
  // Gripper generators
  'gripper_open',
  'gripper_close',
  'gripper_set_speed',
  'gripper_get_status',
  
  // Vision generators
  'vision_detect_line',
  'vision_detect_marker',
  'vision_detect_people',
  'vision_detect_pose',
  'vision_set_mode',
  
  // Events generators
  'event_armor_hit',
  'event_vision_detection',
  'event_battery_low',
  'event_register',
  
  // Robot initialization generators
  'robomaster_init',
  'robomaster_close'
};