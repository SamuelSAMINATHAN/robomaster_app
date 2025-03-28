Blockly.Python['gripper_open'] = function(block) {
  var code = 'robot.gripper.open()\n';
  return code;
};

Blockly.Python['gripper_close'] = function(block) {
  var code = 'robot.gripper.close()\n';
  return code;
};

Blockly.Python['gripper_set_speed'] = function(block) {
  var speed = Blockly.Python.valueToCode(block, 'SPEED', Blockly.Python.ORDER_ATOMIC) || '0';
  var code = 'robot.gripper.set_speed(speed=' + speed + ')\n';
  return code;
};

Blockly.Python['gripper_get_status'] = function(block) {
  var code = 'robot.gripper.get_status()';
  return [code, Blockly.Python.ORDER_ATOMIC];
}; 