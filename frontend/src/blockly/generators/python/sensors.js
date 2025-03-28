Blockly.Python['battery_level'] = function(block) {
  var code = 'robot.battery.get_level()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['battery_voltage'] = function(block) {
  var code = 'robot.battery.get_voltage()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['armor_hit'] = function(block) {
  var position = block.getFieldValue('ARMOR_POSITION');
  var code = 'robot.armor.get_hit(' + position + ')';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['sensor_distance'] = function(block) {
  var position = block.getFieldValue('SENSOR_POSITION');
  var code = 'robot.sensor.get_distance(' + position + ')';
  return [code, Blockly.Python.ORDER_ATOMIC];
}; 