/****************************************************
 * Définition des blocs Blockly pour chaque fonction
 * Python du fichier robomaster_server.py
 ****************************************************/

Blockly.Blocks["robomaster_start"] = {
  init: function () {
    this.appendDummyInput().appendField("Démarrer la connexion");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Initialize connection with the RoboMaster robot.");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_stop"] = {
  init: function () {
    this.appendDummyInput().appendField("Arrêter la connexion");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Stop the connection with the RoboMaster robot.");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_set_flash"] = {
  init: function () {
    this.appendDummyInput().appendField("Allumer flash (LED)"); 
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Set flash LED effect.");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_set_bottom_led"] = {
  init: function () {
    this.appendDummyInput().appendField("Allumer LED du dessous");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Set bottom LED effect.");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_set_top_led"] = {
  init: function () {
    this.appendDummyInput().appendField("Allumer LED du dessus");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Set top LED effect.");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_set_signle_led"] = {
  init: function () {
    this.appendDummyInput().appendField("Allumer LED unique");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Set a single LED effect.");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_turn_off"] = {
  init: function () {
    this.appendDummyInput().appendField("Éteindre LEDs");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Turn off LEDs.");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_set_pwm_value"] = {
  init: function () {
    this.appendDummyInput().appendField("Configurer PWM");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Set PWM value.");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_enable_stick_overlay"] = {
  init: function () {
    this.appendDummyInput().appendField("Activer stick overlay");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Enable stick overlay.");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_set_follow_gimbal_offset"] = {
  init: function () {
    this.appendDummyInput().appendField("Configurer offset gimbal");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Set follow gimbal offset.");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_set_trans_speed"] = {
  init: function () {
    this.appendDummyInput().appendField("Configurer vitesse de translation");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Set translation speed.");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_set_rotate_speed"] = {
  init: function () {
    this.appendDummyInput().appendField("Configurer vitesse de rotation");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Set rotation speed.");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_set_wheel_speed"] = {
  init: function () {
    this.appendDummyInput().appendField("Configurer vitesse des roues");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Set wheel speed.");
    this.setHelpUrl("");
  },
};

// move(x, y, z, speed)
Blockly.Blocks["robomaster_move"] = {
  init: function () {
    this.appendDummyInput().appendField("Avancer le robot (x,y,z,speed)");
    this.appendValueInput("X")
        .setCheck("Number")
        .appendField("x");
    this.appendValueInput("Y")
        .setCheck("Number")
        .appendField("y");
    this.appendValueInput("Z")
        .setCheck("Number")
        .appendField("z");
    this.appendValueInput("SPEED")
        .setCheck("Number")
        .appendField("vitesse");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Move the robot with x,y,z and speed.");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_move_with_time"] = {
  init: function () {
    this.appendDummyInput().appendField("Avancer le robot sur une durée");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Move the robot with a specified time (not implemented).");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_move_with_distance"] = {
  init: function () {
    this.appendDummyInput().appendField("Avancer le robot sur une distance");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Move the robot with a specified distance (not implemented).");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_move_degree_with_speed"] = {
  init: function () {
    this.appendDummyInput().appendField("Avancer le robot (angle + vitesse)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Move the robot with a certain angle and speed (not implemented).");
    this.setHelpUrl("");
  },
};

// rotate(angle, speed)
Blockly.Blocks["robomaster_rotate"] = {
  init: function () {
    this.appendDummyInput().appendField("Pivoter le robot (angle,speed)");
    this.appendValueInput("ANGLE")
        .setCheck("Number")
        .appendField("angle");
    this.appendValueInput("SPEED")
        .setCheck("Number")
        .appendField("vitesse");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Rotate the robot by a given angle and speed.");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_rotate_with_time"] = {
  init: function () {
    this.appendDummyInput().appendField("Pivoter avec temps");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Rotate the robot using a given time (not implemented).");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_rotate_with_degree"] = {
  init: function () {
    this.appendDummyInput().appendField("Pivoter avec degrés");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Rotate the robot with a certain degree (not implemented).");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_move_and_rotate"] = {
  init: function () {
    this.appendDummyInput().appendField("Avancer et pivoter simultanément");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Move and rotate the robot simultaneously (not implemented).");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_move_with_speed"] = {
  init: function () {
    this.appendDummyInput().appendField("Avancer avec vitesse");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Move with speed (not implemented).");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_get_attitude"] = {
  init: function () {
    this.appendDummyInput().appendField("Obtenir l'attitude");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Get the robot's attitude (not implemented).");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_get_position_based_power_on"] = {
  init: function () {
    this.appendDummyInput().appendField("Obtenir la position based power on");
    this.setOutput(true, null);
    this.setColour(230);
    this.setTooltip("Get position-based power on data (not implemented).");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_chassis_impact_detection"] = {
  init: function () {
    this.appendDummyInput().appendField("Détection d'impact (châssis)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Enable chassis impact detection (not implemented).");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_is_impact"] = {
  init: function () {
    this.appendDummyInput().appendField("Vérifier s'il y a eu impact");
    this.setOutput(true, "Boolean");
    this.setColour(230);
    this.setTooltip("Check if there's an impact (not implemented).");
    this.setHelpUrl("");
  },
};

// set_gripper(action='open'|'close'|'stop')
Blockly.Blocks["robomaster_set_gripper"] = {
  init: function () {
    this.appendDummyInput()
        .appendField("Gripper")
        .appendField(
          new Blockly.FieldDropdown([
            ["ouvrir", "open"],
            ["fermer", "close"],
            ["stop", "stop"],
          ]),
          "ACTION"
        );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Control the gripper (open/close/stop).");
    this.setHelpUrl("");
  },
};

// arm_move(direction, distance)
Blockly.Blocks["robomaster_arm_move"] = {
  init: function () {
    this.appendDummyInput()
        .appendField("Déplacer le bras direction")
        .appendField(
          new Blockly.FieldDropdown([
            ["avant", "forward"],
            ["arrière", "backward"],
            ["haut", "up"],
            ["bas", "down"],
          ]),
          "DIRECTION"
        );
    this.appendValueInput("DISTANCE")
        .setCheck("Number")
        .appendField("distance");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Control the arm movement (forward/backward/up/down).");
    this.setHelpUrl("");
  },
};

// arm_move_to(x, y)
Blockly.Blocks["robomaster_arm_move_to"] = {
  init: function () {
    this.appendDummyInput().appendField("Déplacer le bras vers (x,y)");
    this.appendValueInput("X")
        .setCheck("Number")
        .appendField("x");
    this.appendValueInput("Y")
        .setCheck("Number")
        .appendField("y");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Move the robotic arm to absolute position x,y.");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_set_hit_sensitivity"] = {
  init: function () {
    this.appendDummyInput().appendField("Régler la sensibilité des impacts");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Set armor hit sensitivity (not implemented).");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_armor_hit_detection_all"] = {
  init: function () {
    this.appendDummyInput().appendField("Activer détection d'impacts (tous)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Enable armor hit detection on all panels (not implemented).");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_get_last_hit_index"] = {
  init: function () {
    this.appendDummyInput().appendField("Obtenir la dernière zone impactée");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Get the last armor hit index (not implemented).");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_check_condition"] = {
  init: function () {
    this.appendDummyInput().appendField("Vérifier condition");
    this.setOutput(true, "Boolean");
    this.setColour(230);
    this.setTooltip("Check a condition (not implemented).");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_cond_wait"] = {
  init: function () {
    this.appendDummyInput().appendField("Attendre la condition");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Wait for a condition (not implemented).");
    this.setHelpUrl("");
  },
};

// La fonction play_sound apparaît deux fois dans le code. On crée deux blocs distincts:
Blockly.Blocks["robomaster_play_sound"] = {
  init: function () {
    this.appendDummyInput().appendField("Jouer un son (1ère version)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Play a sound (function #1).");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_play_sound_2"] = {
  init: function () {
    this.appendDummyInput().appendField("Jouer un son (2ème version)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Play a sound (function #2).");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_capture"] = {
  init: function () {
    this.appendDummyInput().appendField("Capturer une photo");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Capture an image (not implemented).");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_record"] = {
  init: function () {
    this.appendDummyInput().appendField("Enregistrer une vidéo");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Start recording (not implemented).");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["robomaster_say"] = {
  init: function () {
    this.appendDummyInput().appendField("Dire un texte");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Make the robot say something (not implemented).");
    this.setHelpUrl("");
  },
};