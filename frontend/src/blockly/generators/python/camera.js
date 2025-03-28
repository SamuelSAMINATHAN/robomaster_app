Blockly.Python['camera_start'] = function(block) {
  var code = 'robot.camera.start()\n';
  return code;
};

Blockly.Python['camera_stop'] = function(block) {
  var code = 'robot.camera.stop()\n';
  return code;
};

Blockly.Python['camera_read'] = function(block) {
  var code = 'robot.camera.read()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['camera_set_resolution'] = function(block) {
  var resolution = block.getFieldValue('RESOLUTION');
  var code = 'robot.camera.set_resolution(resolution="' + resolution + '")\n';
  return code;
}; 