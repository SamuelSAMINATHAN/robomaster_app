Blockly.Python['chassis_move'] = function(block) {
  var x_speed = Blockly.Python.valueToCode(block, 'X_SPEED', Blockly.Python.ORDER_ATOMIC) || '0';
  var y_speed = Blockly.Python.valueToCode(block, 'Y_SPEED', Blockly.Python.ORDER_ATOMIC) || '0';
  var z_speed = Blockly.Python.valueToCode(block, 'Z_SPEED', Blockly.Python.ORDER_ATOMIC) || '0';
  var duration = Blockly.Python.valueToCode(block, 'DURATION', Blockly.Python.ORDER_ATOMIC) || '0';
  
  var code = 'robot.chassis.move(x=' + x_speed + ', y=' + y_speed + ', z=' + z_speed + ', duration=' + duration + ')\n';
  return code;
};

Blockly.Python['chassis_stop'] = function(block) {
  var code = 'robot.chassis.stop()\n';
  return code;
};

Blockly.Python['chassis_set_speed'] = function(block) {
  var x_speed = Blockly.Python.valueToCode(block, 'X_SPEED', Blockly.Python.ORDER_ATOMIC) || '0';
  var y_speed = Blockly.Python.valueToCode(block, 'Y_SPEED', Blockly.Python.ORDER_ATOMIC) || '0';
  var z_speed = Blockly.Python.valueToCode(block, 'Z_SPEED', Blockly.Python.ORDER_ATOMIC) || '0';
  
  var code = 'robot.chassis.set_speed(x=' + x_speed + ', y=' + y_speed + ', z=' + z_speed + ')\n';
  return code;
}; 