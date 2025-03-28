Blockly.Python['vision_detect_line'] = function(block) {
  var code = 'robot.vision.detect_line()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['vision_detect_marker'] = function(block) {
  var code = 'robot.vision.detect_marker()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['vision_detect_people'] = function(block) {
  var code = 'robot.vision.detect_people()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['vision_detect_pose'] = function(block) {
  var code = 'robot.vision.detect_pose()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['vision_set_mode'] = function(block) {
  var mode = block.getFieldValue('MODE');
  var code = 'robot.vision.set_mode(mode="' + mode + '")\n';
  return code;
}; 