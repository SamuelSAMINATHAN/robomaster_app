Blockly.Blocks['camera_start'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Start Camera');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('Start the camera');
  }
};

Blockly.Blocks['camera_stop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Stop Camera');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('Stop the camera');
  }
};

Blockly.Blocks['camera_read'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Read Camera Frame');
    this.setOutput(true, 'Image');
    this.setColour(120);
    this.setTooltip('Read a frame from the camera');
  }
};

Blockly.Blocks['camera_set_resolution'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Set Camera Resolution')
        .appendField(new Blockly.FieldDropdown([
          ['1280x720', '1280x720'],
          ['640x480', '640x480'],
          ['320x240', '320x240']
        ]), 'RESOLUTION');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip('Set camera resolution');
  }
}; 