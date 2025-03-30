import * as Blockly from 'blockly/core';

// Rendre Blockly disponible globalement pour les modules qui en ont besoin
if (typeof window !== 'undefined') {
  window.Blockly = Blockly;
}

// Import all block definitions
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
import './robot_init.js';

// Liste de tous les types de blocs disponibles
const blockTypes = [
  // Chassis blocks
  'chassis_move',
  'chassis_stop',
  'chassis_set_speed',
  
  // Gimbal blocks
  'gimbal_move',
  'gimbal_stop',
  'gimbal_set_speed',
  'gimbal_move_to',
  
  // LED blocks
  'led_set_color',
  'led_effect',
  
  // Camera blocks
  'camera_start',
  'camera_stop',
  'camera_read',
  'camera_set_resolution',
  
  // Blaster blocks
  'blaster_fire',
  'blaster_stop',
  'blaster_set_power',
  
  // Sensors blocks
  'battery_level',
  'battery_voltage',
  'armor_hit',
  'sensor_distance',
  
  // Robotic Arm blocks
  'robotic_arm_move',
  'robotic_arm_move_joint',
  'robotic_arm_stop',
  'robotic_arm_get_position',
  
  // Gripper blocks
  'gripper_open',
  'gripper_close',
  'gripper_set_speed',
  'gripper_get_status',
  
  // Vision blocks
  'vision_detect_line',
  'vision_detect_marker',
  'vision_detect_people',
  'vision_detect_pose',
  'vision_set_mode',
  
  // Events blocks
  'event_armor_hit',
  'event_vision_detection',
  'event_battery_low',
  'event_register',
  
  // Mon Module blocks
  'robomaster_start',
  'robomaster_stop',
  'robomaster_set_flash',
  'robomaster_set_bottom_led',
  'robomaster_set_top_led',
  'robomaster_set_signle_led',
  'robomaster_turn_off',
  'robomaster_set_pwm_value',
  'robomaster_enable_stick_overlay',
  'robomaster_set_follow_gimbal_offset',
  'robomaster_set_trans_speed',
  'robomaster_set_rotate_speed',
  'robomaster_set_wheel_speed',
  'robomaster_move',
  'robomaster_move_with_time',
  'robomaster_move_with_distance',
  'robomaster_move_degree_with_speed',
  'robomaster_rotate',
  'robomaster_rotate_with_time',
  'robomaster_rotate_with_degree',
  'robomaster_move_and_rotate',
  'robomaster_move_with_speed',
  'robomaster_get_attitude',
  'robomaster_get_position_based_power_on',
  'robomaster_chassis_impact_detection',
  'robomaster_is_impact',
  'robomaster_set_gripper',
  'robomaster_arm_move',
  'robomaster_arm_move_to',
  'robomaster_set_hit_sensitivity',
  'robomaster_armor_hit_detection_all',
  'robomaster_get_last_hit_index',
  'robomaster_check_condition',
  'robomaster_cond_wait',
  'robomaster_play_sound',
  'robomaster_play_sound_2',
  'robomaster_capture',
  'robomaster_record',
  'robomaster_say'
];

// Ne pas exporter les noms des blocs directement car cela cause 
// des problèmes dans les modules ES
export default blockTypes;