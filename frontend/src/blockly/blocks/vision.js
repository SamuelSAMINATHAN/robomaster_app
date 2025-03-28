Blockly.Blocks['vision_detect_line'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Detect Line');
    this.setOutput(true, 'Array');
    this.setColour(180);
    this.setTooltip('Detect line in camera feed');
  }
};

Blockly.Blocks['vision_detect_marker'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Detect Marker');
    this.setOutput(true, 'Array');
    this.setColour(180);
    this.setTooltip('Detect marker in camera feed');
  }
};

Blockly.Blocks['vision_detect_people'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Detect People');
    this.setOutput(true, 'Array');
    this.setColour(180);
    this.setTooltip('Detect people in camera feed');
  }
};

Blockly.Blocks['vision_detect_pose'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Detect Pose');
    this.setOutput(true, 'Array');
    this.setColour(180);
    this.setTooltip('Detect pose in camera feed');
  }
};

Blockly.Blocks['vision_set_mode'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Set Vision Mode')
        .appendField(new Blockly.FieldDropdown([
          ['Line Detection', 'line'],
          ['Marker Detection', 'marker'],
          ['People Detection', 'people'],
          ['Pose Detection', 'pose']
        ]), 'MODE');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip('Set vision detection mode');
  }
}; 