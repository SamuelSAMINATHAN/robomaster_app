/**
 * Générateurs Python pour les blocs définis dans mon_module.js
 */
import * as Blockly from 'blockly';

// Générateur pour robomaster_start
Blockly.Python['robomaster_start'] = function(block) {
  return 'robot = robomaster.connect()\n';
};

// Générateur pour robomaster_stop
Blockly.Python['robomaster_stop'] = function(block) {
  return 'robot.disconnect()\n';
};

// Générateur pour robomaster_set_flash
Blockly.Python['robomaster_set_flash'] = function(block) {
  return 'robot.set_flash()\n';
};

// Générateur pour robomaster_set_bottom_led
Blockly.Python['robomaster_set_bottom_led'] = function(block) {
  return 'robot.set_bottom_led()\n';
};

// Générateur pour robomaster_set_top_led
Blockly.Python['robomaster_set_top_led'] = function(block) {
  return 'robot.set_top_led()\n';
};

// Générateur pour robomaster_set_signle_led
Blockly.Python['robomaster_set_signle_led'] = function(block) {
  return 'robot.set_single_led()\n';
};

// Générateur pour robomaster_turn_off
Blockly.Python['robomaster_turn_off'] = function(block) {
  return 'robot.turn_off_leds()\n';
};

// Générateur pour robomaster_set_pwm_value
Blockly.Python['robomaster_set_pwm_value'] = function(block) {
  return 'robot.set_pwm_value()\n';
};

// Générateur pour robomaster_enable_stick_overlay
Blockly.Python['robomaster_enable_stick_overlay'] = function(block) {
  return 'robot.enable_stick_overlay()\n';
};

// Générateur pour robomaster_set_follow_gimbal_offset
Blockly.Python['robomaster_set_follow_gimbal_offset'] = function(block) {
  return 'robot.set_follow_gimbal_offset()\n';
};

// Générateur pour robomaster_set_trans_speed
Blockly.Python['robomaster_set_trans_speed'] = function(block) {
  return 'robot.set_trans_speed()\n';
};

// Générateur pour robomaster_set_rotate_speed
Blockly.Python['robomaster_set_rotate_speed'] = function(block) {
  return 'robot.set_rotate_speed()\n';
};

// Générateur pour robomaster_set_wheel_speed
Blockly.Python['robomaster_set_wheel_speed'] = function(block) {
  return 'robot.set_wheel_speed()\n';
};

// Générateur pour robomaster_move
Blockly.Python['robomaster_move'] = function(block) {
  const x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_ATOMIC) || '0';
  const y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_ATOMIC) || '0';
  const z = Blockly.Python.valueToCode(block, 'Z', Blockly.Python.ORDER_ATOMIC) || '0';
  const speed = Blockly.Python.valueToCode(block, 'SPEED', Blockly.Python.ORDER_ATOMIC) || '0.5';
  
  return `robot.move(x=${x}, y=${y}, z=${z}, speed=${speed})\n`;
};

// Générateur pour robomaster_move_with_time
Blockly.Python['robomaster_move_with_time'] = function(block) {
  return 'robot.move_with_time()\n';
};

// Générateur pour robomaster_move_with_distance
Blockly.Python['robomaster_move_with_distance'] = function(block) {
  return 'robot.move_with_distance()\n';
};

// Générateur pour robomaster_move_degree_with_speed
Blockly.Python['robomaster_move_degree_with_speed'] = function(block) {
  return 'robot.move_degree_with_speed()\n';
};

// Générateur pour robomaster_rotate
Blockly.Python['robomaster_rotate'] = function(block) {
  const angle = Blockly.Python.valueToCode(block, 'ANGLE', Blockly.Python.ORDER_ATOMIC) || '0';
  const speed = Blockly.Python.valueToCode(block, 'SPEED', Blockly.Python.ORDER_ATOMIC) || '30';
  
  return `robot.rotate(angle=${angle}, speed=${speed})\n`;
};

// Générateur pour robomaster_rotate_with_time
Blockly.Python['robomaster_rotate_with_time'] = function(block) {
  return 'robot.rotate_with_time()\n';
};

// Générateur pour robomaster_rotate_with_degree
Blockly.Python['robomaster_rotate_with_degree'] = function(block) {
  return 'robot.rotate_with_degree()\n';
};

// Générateur pour robomaster_move_and_rotate
Blockly.Python['robomaster_move_and_rotate'] = function(block) {
  return 'robot.move_and_rotate()\n';
};

// Générateur pour robomaster_move_with_speed
Blockly.Python['robomaster_move_with_speed'] = function(block) {
  return 'robot.move_with_speed()\n';
};

// Générateur pour robomaster_get_attitude
Blockly.Python['robomaster_get_attitude'] = function(block) {
  return ['robot.get_attitude()', Blockly.Python.ORDER_FUNCTION_CALL];
};

// Générateur pour robomaster_get_position_based_power_on
Blockly.Python['robomaster_get_position_based_power_on'] = function(block) {
  return ['robot.get_position_based_power_on()', Blockly.Python.ORDER_FUNCTION_CALL];
};

// Générateur pour robomaster_chassis_impact_detection
Blockly.Python['robomaster_chassis_impact_detection'] = function(block) {
  return 'robot.chassis_impact_detection()\n';
};

// Générateur pour robomaster_is_impact
Blockly.Python['robomaster_is_impact'] = function(block) {
  return ['robot.is_impact()', Blockly.Python.ORDER_FUNCTION_CALL];
};

// Générateur pour robomaster_set_gripper
Blockly.Python['robomaster_set_gripper'] = function(block) {
  const action = block.getFieldValue('ACTION');
  return `robot.set_gripper(action='${action}')\n`;
};

// Générateur pour robomaster_arm_move
Blockly.Python['robomaster_arm_move'] = function(block) {
  const direction = block.getFieldValue('DIRECTION');
  const distance = Blockly.Python.valueToCode(block, 'DISTANCE', Blockly.Python.ORDER_ATOMIC) || '10';
  
  return `robot.arm_move(direction='${direction}', distance=${distance})\n`;
};

// Générateur pour robomaster_arm_move_to
Blockly.Python['robomaster_arm_move_to'] = function(block) {
  const x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_ATOMIC) || '0';
  const y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_ATOMIC) || '0';
  
  return `robot.arm_move_to(x=${x}, y=${y})\n`;
};

// Générateur pour robomaster_set_hit_sensitivity
Blockly.Python['robomaster_set_hit_sensitivity'] = function(block) {
  return 'robot.set_hit_sensitivity()\n';
};

// Générateur pour robomaster_armor_hit_detection_all
Blockly.Python['robomaster_armor_hit_detection_all'] = function(block) {
  return 'robot.armor_hit_detection_all()\n';
};

// Générateur pour robomaster_get_last_hit_index
Blockly.Python['robomaster_get_last_hit_index'] = function(block) {
  return ['robot.get_last_hit_index()', Blockly.Python.ORDER_FUNCTION_CALL];
};

// Générateur pour robomaster_check_condition
Blockly.Python['robomaster_check_condition'] = function(block) {
  return ['robot.check_condition()', Blockly.Python.ORDER_FUNCTION_CALL];
};

// Générateur pour robomaster_cond_wait
Blockly.Python['robomaster_cond_wait'] = function(block) {
  return 'robot.cond_wait()\n';
};

// Générateur pour robomaster_play_sound
Blockly.Python['robomaster_play_sound'] = function(block) {
  return 'robot.play_sound()\n';
};

// Générateur pour robomaster_play_sound_2
Blockly.Python['robomaster_play_sound_2'] = function(block) {
  return 'robot.play_sound_2()\n';
};

// Générateur pour robomaster_capture
Blockly.Python['robomaster_capture'] = function(block) {
  return 'robot.capture()\n';
};

// Générateur pour robomaster_record
Blockly.Python['robomaster_record'] = function(block) {
  return 'robot.record()\n';
};

// Générateur pour robomaster_say
Blockly.Python['robomaster_say'] = function(block) {
  return 'robot.say()\n';
};