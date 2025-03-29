// Import all Python generators
import './chassis.js';
import './gimbal.js';
import './led.js';
import './camera.js';
import './blaster.js';
import './sensors.js';
import './robotic_arm.js';
import './gripper.js';
import './vision.js';
import './events.js';

// Add initialization code
Blockly.Python['robomaster_init'] = function(block) {
  var code = 'from robomaster import robot\n\n' +
             '# Initialize the robot\n' +
             'robot = robot.Robot()\n' +
             'robot.initialize()\n\n';
  return code;
};

Blockly.Python['robomaster_close'] = function(block) {
  var code = '# Close the robot connection\n' +
             'robot.close()\n';
  return code;
};

// Add these blocks to the toolbox
const toolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Robot',
      colour: 0,
      contents: [
        { kind: 'block', type: 'robomaster_init' },
        { kind: 'block', type: 'robomaster_close' }
      ]
    }
  ]
};

// Export the toolbox
export { toolbox }; 