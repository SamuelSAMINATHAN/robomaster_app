Blockly.Blocks['battery_level'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Get Battery Level');
    this.setOutput(true, 'Number');
    this.setColour(60);
    this.setTooltip('Get the current battery level');
  }
};

Blockly.Blocks['battery_voltage'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Get Battery Voltage');
    this.setOutput(true, 'Number');
    this.setColour(60);
    this.setTooltip('Get the current battery voltage');
  }
};

Blockly.Blocks['armor_hit'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Get Armor Hit')
        .appendField(new Blockly.FieldDropdown([
          ['Front', 'front'],
          ['Back', 'back'],
          ['Left', 'left'],
          ['Right', 'right']
        ]), 'ARMOR_POSITION');
    this.setOutput(true, 'Boolean');
    this.setColour(60);
    this.setTooltip('Check if specified armor was hit');
  }
};

Blockly.Blocks['sensor_distance'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Get Distance Sensor Value')
        .appendField(new Blockly.FieldDropdown([
          ['Front', 'front'],
          ['Back', 'back'],
          ['Left', 'left'],
          ['Right', 'right']
        ]), 'SENSOR_POSITION');
    this.setOutput(true, 'Number');
    this.setColour(60);
    this.setTooltip('Get distance sensor value for specified position');
  }
}; 