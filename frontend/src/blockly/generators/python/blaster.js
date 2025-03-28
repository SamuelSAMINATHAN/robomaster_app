Blockly.Python['blaster_fire'] = function(block) {
  var fire_mode = block.getFieldValue('FIRE_MODE');
  var code = 'robot.blaster.fire(mode="' + fire_mode + '")\n';
  return code;
};

Blockly.Python['blaster_stop'] = function(block) {
  var code = 'robot.blaster.stop()\n';
  return code;
};

Blockly.Python['blaster_set_power'] = function(block) {
  var power = Blockly.Python.valueToCode(block, 'POWER', Blockly.Python.ORDER_ATOMIC) || '0';
  var code = 'robot.blaster.set_power(power=' + power + ')\n';
  return code;
}; 