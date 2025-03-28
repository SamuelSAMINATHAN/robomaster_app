Blockly.Python['gimbal_move'] = function(block) {
  var pitch_speed = Blockly.Python.valueToCode(block, 'PITCH_SPEED', Blockly.Python.ORDER_ATOMIC) || '0';
  var yaw_speed = Blockly.Python.valueToCode(block, 'YAW_SPEED', Blockly.Python.ORDER_ATOMIC) || '0';
  var duration = Blockly.Python.valueToCode(block, 'DURATION', Blockly.Python.ORDER_ATOMIC) || '0';
  
  var code = 'robot.gimbal.move(pitch_speed=' + pitch_speed + ', yaw_speed=' + yaw_speed + ', duration=' + duration + ')\n';
  return code;
};

Blockly.Python['gimbal_stop'] = function(block) {
  var code = 'robot.gimbal.stop()\n';
  return code;
};

Blockly.Python['gimbal_set_speed'] = function(block) {
  var pitch_speed = Blockly.Python.valueToCode(block, 'PITCH_SPEED', Blockly.Python.ORDER_ATOMIC) || '0';
  var yaw_speed = Blockly.Python.valueToCode(block, 'YAW_SPEED', Blockly.Python.ORDER_ATOMIC) || '0';
  
  var code = 'robot.gimbal.set_speed(pitch_speed=' + pitch_speed + ', yaw_speed=' + yaw_speed + ')\n';
  return code;
};

Blockly.Python['gimbal_move_to'] = function(block) {
  var pitch_angle = Blockly.Python.valueToCode(block, 'PITCH_ANGLE', Blockly.Python.ORDER_ATOMIC) || '0';
  var yaw_angle = Blockly.Python.valueToCode(block, 'YAW_ANGLE', Blockly.Python.ORDER_ATOMIC) || '0';
  var speed = Blockly.Python.valueToCode(block, 'SPEED', Blockly.Python.ORDER_ATOMIC) || '0';
  
  var code = 'robot.gimbal.move_to(pitch=' + pitch_angle + ', yaw=' + yaw_angle + ', speed=' + speed + ')\n';
  return code;
}; 