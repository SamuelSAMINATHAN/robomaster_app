Blockly.Blocks['chassis_move'] = {
  init: function() {
    this.appendValueInput('X_SPEED')
        .setCheck('Number')
        .appendField('Chassis Move X Speed');
    this.appendValueInput('Y_SPEED')
        .setCheck('Number')
        .appendField('Y Speed');
    this.appendValueInput('Z_SPEED')
        .setCheck('Number')
        .appendField('Z Speed');
    this.appendValueInput('DURATION')
        .setCheck('Number')
        .appendField('Duration (s)');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('Move the chassis with specified speeds');
  }
};

Blockly.Blocks['chassis_stop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Stop Chassis');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('Stop the chassis movement');
  }
};

Blockly.Blocks['chassis_set_speed'] = {
  init: function() {
    this.appendValueInput('X_SPEED')
        .setCheck('Number')
        .appendField('Set Chassis X Speed');
    this.appendValueInput('Y_SPEED')
        .setCheck('Number')
        .appendField('Y Speed');
    this.appendValueInput('Z_SPEED')
        .setCheck('Number')
        .appendField('Z Speed');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('Set chassis speed without duration');
  }
}; 