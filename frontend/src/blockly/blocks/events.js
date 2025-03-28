Blockly.Blocks['event_armor_hit'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('On Armor Hit')
        .appendField(new Blockly.FieldDropdown([
          ['Front', 'front'],
          ['Back', 'back'],
          ['Left', 'left'],
          ['Right', 'right']
        ]), 'ARMOR_POSITION');
    this.appendStatementInput('DO')
        .setCheck(null)
        .appendField('Do');
    this.setColour(120);
    this.setTooltip('Execute code when specified armor is hit');
  }
};

Blockly.Blocks['event_vision_detection'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('On Vision Detection')
        .appendField(new Blockly.FieldDropdown([
          ['Line', 'line'],
          ['Marker', 'marker'],
          ['People', 'people'],
          ['Pose', 'pose']
        ]), 'DETECTION_TYPE');
    this.appendStatementInput('DO')
        .setCheck(null)
        .appendField('Do');
    this.setColour(120);
    this.setTooltip('Execute code when vision detects specified object');
  }
};

Blockly.Blocks['event_battery_low'] = {
  init: function() {
    this.appendValueInput('THRESHOLD')
        .setCheck('Number')
        .appendField('On Battery Below');
    this.appendStatementInput('DO')
        .setCheck(null)
        .appendField('Do');
    this.setColour(120);
    this.setTooltip('Execute code when battery level is below threshold');
  }
};

Blockly.Blocks['event_register'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Register Event Handler');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('Register all event handlers');
  }
}; 