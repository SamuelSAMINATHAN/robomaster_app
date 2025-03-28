Blockly.Blocks['gimbal_move'] = {
  init: function() {
    this.appendValueInput('PITCH_SPEED')
        .setCheck('Number')
        .appendField('Gimbal Move Pitch Speed');
    this.appendValueInput('YAW_SPEED')
        .setCheck('Number')
        .appendField('Yaw Speed');
    this.appendValueInput('DURATION')
        .setCheck('Number')
        .appendField('Duration (s)');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip('Move the gimbal with specified speeds');
  }
};

Blockly.Blocks['gimbal_stop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Stop Gimbal');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip('Stop the gimbal movement');
  }
};

Blockly.Blocks['gimbal_set_speed'] = {
  init: function() {
    this.appendValueInput('PITCH_SPEED')
        .setCheck('Number')
        .appendField('Set Gimbal Pitch Speed');
    this.appendValueInput('YAW_SPEED')
        .setCheck('Number')
        .appendField('Yaw Speed');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip('Set gimbal speed without duration');
  }
};

Blockly.Blocks['gimbal_move_to'] = {
  init: function() {
    this.appendValueInput('PITCH_ANGLE')
        .setCheck('Number')
        .appendField('Gimbal Move To Pitch Angle');
    this.appendValueInput('YAW_ANGLE')
        .setCheck('Number')
        .appendField('Yaw Angle');
    this.appendValueInput('SPEED')
        .setCheck('Number')
        .appendField('Speed');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip('Move gimbal to specific angles');
  }
}; 