Blockly.Blocks['robotic_arm_move'] = {
  init: function() {
    this.appendValueInput('X')
        .setCheck('Number')
        .appendField('Move Robotic Arm X');
    this.appendValueInput('Y')
        .setCheck('Number')
        .appendField('Y');
    this.appendValueInput('Z')
        .setCheck('Number')
        .appendField('Z');
    this.appendValueInput('SPEED')
        .setCheck('Number')
        .appendField('Speed');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(340);
    this.setTooltip('Move robotic arm to specified coordinates');
  }
};

Blockly.Blocks['robotic_arm_move_joint'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Move Joint')
        .appendField(new Blockly.FieldDropdown([
          ['Joint 1', '1'],
          ['Joint 2', '2'],
          ['Joint 3', '3'],
          ['Joint 4', '4'],
          ['Joint 5', '5'],
          ['Joint 6', '6']
        ]), 'JOINT');
    this.appendValueInput('ANGLE')
        .setCheck('Number')
        .appendField('Angle');
    this.appendValueInput('SPEED')
        .setCheck('Number')
        .appendField('Speed');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(340);
    this.setTooltip('Move specific joint of robotic arm');
  }
};

Blockly.Blocks['robotic_arm_stop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Stop Robotic Arm');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(340);
    this.setTooltip('Stop robotic arm movement');
  }
};

Blockly.Blocks['robotic_arm_get_position'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Get Robotic Arm Position');
    this.setOutput(true, 'Array');
    this.setColour(340);
    this.setTooltip('Get current position of robotic arm');
  }
}; 