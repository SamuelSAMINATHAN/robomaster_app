Blockly.Python['event_armor_hit'] = function(block) {
  var position = block.getFieldValue('ARMOR_POSITION');
  var statements = Blockly.Python.statementToCode(block, 'DO');
  
  var code = 'def on_armor_hit_' + position + '():\n' +
             '    ' + statements + '\n\n' +
             'robot.armor.on_hit(' + position + ', on_armor_hit_' + position + ')\n';
  return code;
};

Blockly.Python['event_vision_detection'] = function(block) {
  var detection_type = block.getFieldValue('DETECTION_TYPE');
  var statements = Blockly.Python.statementToCode(block, 'DO');
  
  var code = 'def on_vision_' + detection_type + '():\n' +
             '    ' + statements + '\n\n' +
             'robot.vision.on_detection("' + detection_type + '", on_vision_' + detection_type + ')\n';
  return code;
};

Blockly.Python['event_battery_low'] = function(block) {
  var threshold = Blockly.Python.valueToCode(block, 'THRESHOLD', Blockly.Python.ORDER_ATOMIC) || '20';
  var statements = Blockly.Python.statementToCode(block, 'DO');
  
  var code = 'def on_battery_low():\n' +
             '    ' + statements + '\n\n' +
             'robot.battery.on_low(' + threshold + ', on_battery_low)\n';
  return code;
};

Blockly.Python['event_register'] = function(block) {
  var code = 'robot.event.register()\n';
  return code;
}; 