Blockly.Python['led_set_color'] = function(block) {
  var r = Blockly.Python.valueToCode(block, 'R', Blockly.Python.ORDER_ATOMIC) || '0';
  var g = Blockly.Python.valueToCode(block, 'G', Blockly.Python.ORDER_ATOMIC) || '0';
  var b = Blockly.Python.valueToCode(block, 'B', Blockly.Python.ORDER_ATOMIC) || '0';
  var position = block.getFieldValue('LED_POSITION');
  
  var code = 'robot.led.set(' + position + ', r=' + r + ', g=' + g + ', b=' + b + ')\n';
  return code;
};

Blockly.Python['led_effect'] = function(block) {
  var effect = block.getFieldValue('EFFECT');
  var r = Blockly.Python.valueToCode(block, 'R', Blockly.Python.ORDER_ATOMIC) || '0';
  var g = Blockly.Python.valueToCode(block, 'G', Blockly.Python.ORDER_ATOMIC) || '0';
  var b = Blockly.Python.valueToCode(block, 'B', Blockly.Python.ORDER_ATOMIC) || '0';
  var frequency = Blockly.Python.valueToCode(block, 'FREQUENCY', Blockly.Python.ORDER_ATOMIC) || '1';
  
  var code = 'robot.led.set_effect(effect="' + effect + '", r=' + r + ', g=' + g + ', b=' + b + ', frequency=' + frequency + ')\n';
  return code;
}; 