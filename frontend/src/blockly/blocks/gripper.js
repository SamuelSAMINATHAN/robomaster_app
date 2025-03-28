Blockly.Blocks['gripper_open'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Open Gripper');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(300);
    this.setTooltip('Open the gripper');
  }
};

Blockly.Blocks['gripper_close'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Close Gripper');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(300);
    this.setTooltip('Close the gripper');
  }
};

Blockly.Blocks['gripper_set_speed'] = {
  init: function() {
    this.appendValueInput('SPEED')
        .setCheck('Number')
        .appendField('Set Gripper Speed');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(300);
    this.setTooltip('Set gripper movement speed');
  }
};

Blockly.Blocks['gripper_get_status'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Get Gripper Status');
    this.setOutput(true, 'Boolean');
    this.setColour(300);
    this.setTooltip('Get gripper status (true = open, false = closed)');
  }
}; 