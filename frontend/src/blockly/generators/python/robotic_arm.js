Blockly.Python['robotic_arm_move'] = function(block) {
  var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_ATOMIC) || '0';
  var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_ATOMIC) || '0';
  var z = Blockly.Python.valueToCode(block, 'Z', Blockly.Python.ORDER_ATOMIC) || '0';
  var speed = Blockly.Python.valueToCode(block, 'SPEED', Blockly.Python.ORDER_ATOMIC) || '0';
  
  var code = 'robot.robotic_arm.move(x=' + x + ', y=' + y + ', z=' + z + ', speed=' + speed + ')\n';
  return code;
};

Blockly.Python['robotic_arm_move_joint'] = function(block) {
  var joint = block.getFieldValue('JOINT');
  var angle = Blockly.Python.valueToCode(block, 'ANGLE', Blockly.Python.ORDER_ATOMIC) || '0';
  var speed = Blockly.Python.valueToCode(block, 'SPEED', Blockly.Python.ORDER_ATOMIC) || '0';
  
  var code = 'robot.robotic_arm.move_joint(joint=' + joint + ', angle=' + angle + ', speed=' + speed + ')\n';
  return code;
};

Blockly.Python['robotic_arm_stop'] = function(block) {
  var code = 'robot.robotic_arm.stop()\n';
  return code;
};

Blockly.Python['robotic_arm_get_position'] = function(block) {
  var code = 'robot.robotic_arm.get_position()';
  return [code, Blockly.Python.ORDER_ATOMIC];
}; 