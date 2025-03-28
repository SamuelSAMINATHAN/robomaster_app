Blockly.Blocks['blaster_fire'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Fire Blaster')
        .appendField(new Blockly.FieldDropdown([
          ['Single Shot', 'single'],
          ['Continuous Fire', 'continuous']
        ]), 'FIRE_MODE');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(200);
    this.setTooltip('Fire the blaster in specified mode');
  }
};

Blockly.Blocks['blaster_stop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Stop Blaster');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(200);
    this.setTooltip('Stop the blaster');
  }
};

Blockly.Blocks['blaster_set_power'] = {
  init: function() {
    this.appendValueInput('POWER')
        .setCheck('Number')
        .appendField('Set Blaster Power');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(200);
    this.setTooltip('Set blaster power level');
  }
}; 