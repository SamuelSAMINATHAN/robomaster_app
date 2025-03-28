Blockly.Blocks['led_set_color'] = {
  init: function() {
    this.appendValueInput('R')
        .setCheck('Number')
        .appendField('Set LED Color R');
    this.appendValueInput('G')
        .setCheck('Number')
        .appendField('G');
    this.appendValueInput('B')
        .setCheck('Number')
        .appendField('B');
    this.appendDummyInput()
        .appendField('for')
        .appendField(new Blockly.FieldDropdown([
          ['All LEDs', 'all'],
          ['Top LED', 'top'],
          ['Bottom LED', 'bottom'],
          ['Left LED', 'left'],
          ['Right LED', 'right']
        ]), 'LED_POSITION');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip('Set LED color for specified position');
  }
};

Blockly.Blocks['led_effect'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Set LED Effect')
        .appendField(new Blockly.FieldDropdown([
          ['Solid', 'solid'],
          ['Blink', 'blink'],
          ['Pulse', 'pulse'],
          ['Off', 'off']
        ]), 'EFFECT');
    this.appendValueInput('R')
        .setCheck('Number')
        .appendField('R');
    this.appendValueInput('G')
        .setCheck('Number')
        .appendField('G');
    this.appendValueInput('B')
        .setCheck('Number')
        .appendField('B');
    this.appendValueInput('FREQUENCY')
        .setCheck('Number')
        .appendField('Frequency (Hz)');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip('Set LED effect with specified parameters');
  }
}; 