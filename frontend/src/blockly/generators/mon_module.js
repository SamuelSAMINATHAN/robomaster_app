/****************************************************
 * Génération de code Python pour chaque bloc
 * défini dans blocks/mon_module.js
 ****************************************************/

// Pour insérer un champ dans le code Python, on utilise:
// Blockly.Python.valueToCode(block, "NOM_DU_CHAMP", Blockly.Python.ORDER_ATOMIC)

Blockly.Python["robomaster_start"] = function (block) {
    return "start()\n";
  };
  
  Blockly.Python["robomaster_stop"] = function (block) {
    return "stop()\n";
  };
  
  Blockly.Python["robomaster_set_flash"] = function (block) {
    return "set_flash()\n";
  };
  
  Blockly.Python["robomaster_set_bottom_led"] = function (block) {
    return "set_bottom_led()\n";
  };
  
  Blockly.Python["robomaster_set_top_led"] = function (block) {
    return "set_top_led()\n";
  };
  
  Blockly.Python["robomaster_set_signle_led"] = function (block) {
    return "set_signle_led()\n";
  };
  
  Blockly.Python["robomaster_turn_off"] = function (block) {
    return "turn_off()\n";
  };
  
  Blockly.Python["robomaster_set_pwm_value"] = function (block) {
    return "set_pwm_value()\n";
  };
  
  Blockly.Python["robomaster_enable_stick_overlay"] = function (block) {
    return "enable_stick_overlay()\n";
  };
  
  Blockly.Python["robomaster_set_follow_gimbal_offset"] = function (block) {
    return "set_follow_gimbal_offset()\n";
  };
  
  Blockly.Python["robomaster_set_trans_speed"] = function (block) {
    return "set_trans_speed()\n";
  };
  
  Blockly.Python["robomaster_set_rotate_speed"] = function (block) {
    return "set_rotate_speed()\n";
  };
  
  Blockly.Python["robomaster_set_wheel_speed"] = function (block) {
    return "set_wheel_speed()\n";
  };
  
  // move(x=..., y=..., z=..., speed=...)
  Blockly.Python["robomaster_move"] = function (block) {
    var x = Blockly.Python.valueToCode(block, "X", Blockly.Python.ORDER_ATOMIC) || "0";
    var y = Blockly.Python.valueToCode(block, "Y", Blockly.Python.ORDER_ATOMIC) || "0";
    var z = Blockly.Python.valueToCode(block, "Z", Blockly.Python.ORDER_ATOMIC) || "0";
    var speed = Blockly.Python.valueToCode(block, "SPEED", Blockly.Python.ORDER_ATOMIC) || "0.5";
    return `move(x=${x}, y=${y}, z=${z}, speed=${speed})\n`;
  };
  
  Blockly.Python["robomaster_move_with_time"] = function (block) {
    return "move_with_time()\n";
  };
  
  Blockly.Python["robomaster_move_with_distance"] = function (block) {
    return "move_with_distance()\n";
  };
  
  Blockly.Python["robomaster_move_degree_with_speed"] = function (block) {
    return "move_degree_with_speed()\n";
  };
  
  // rotate(angle=..., speed=...)
  Blockly.Python["robomaster_rotate"] = function (block) {
    var angle = Blockly.Python.valueToCode(block, "ANGLE", Blockly.Python.ORDER_ATOMIC) || "0";
    var speed = Blockly.Python.valueToCode(block, "SPEED", Blockly.Python.ORDER_ATOMIC) || "30";
    return `rotate(angle=${angle}, speed=${speed})\n`;
  };
  
  Blockly.Python["robomaster_rotate_with_time"] = function (block) {
    return "rotate_with_time()\n";
  };
  
  Blockly.Python["robomaster_rotate_with_degree"] = function (block) {
    return "rotate_with_degree()\n";
  };
  
  Blockly.Python["robomaster_move_and_rotate"] = function (block) {
    return "move_and_rotate()\n";
  };
  
  Blockly.Python["robomaster_move_with_speed"] = function (block) {
    return "move_with_speed()\n";
  };
  
  // get_attitude() => renvoie un résultat, on peut le stocker dans une variable en Python
  Blockly.Python["robomaster_get_attitude"] = function (block) {
    // Pour un bloc "output", on renvoie juste l'expression
    return ["get_attitude()", Blockly.Python.ORDER_FUNCTION_CALL];
  };
  
  Blockly.Python["robomaster_get_position_based_power_on"] = function (block) {
    return ["get_position_based_power_on()", Blockly.Python.ORDER_FUNCTION_CALL];
  };
  
  Blockly.Python["robomaster_chassis_impact_detection"] = function (block) {
    return "chassis_impact_detection()\n";
  };
  
  Blockly.Python["robomaster_is_impact"] = function (block) {
    return ["is_impact()", Blockly.Python.ORDER_FUNCTION_CALL];
  };
  
  // set_gripper(action="open"|"close"|"stop")
  Blockly.Python["robomaster_set_gripper"] = function (block) {
    var action = block.getFieldValue("ACTION") || "open";
    return `set_gripper(action='${action}')\n`;
  };
  
  // arm_move(direction, distance)
  Blockly.Python["robomaster_arm_move"] = function (block) {
    var direction = block.getFieldValue("DIRECTION") || "forward";
    var distance = Blockly.Python.valueToCode(block, "DISTANCE", Blockly.Python.ORDER_ATOMIC) || "1";
    return `arm_move(direction='${direction}', distance=${distance})\n`;
  };
  
  // arm_move_to(x, y)
  Blockly.Python["robomaster_arm_move_to"] = function (block) {
    var x = Blockly.Python.valueToCode(block, "X", Blockly.Python.ORDER_ATOMIC) || "1";
    var y = Blockly.Python.valueToCode(block, "Y", Blockly.Python.ORDER_ATOMIC) || "1";
    return `arm_move_to(x=${x}, y=${y})\n`;
  };
  
  Blockly.Python["robomaster_set_hit_sensitivity"] = function (block) {
    return "set_hit_sensitivity()\n";
  };
  
  Blockly.Python["robomaster_armor_hit_detection_all"] = function (block) {
    return "armor_hit_detection_all()\n";
  };
  
  Blockly.Python["robomaster_get_last_hit_index"] = function (block) {
    return ["get_last_hit_index()", Blockly.Python.ORDER_FUNCTION_CALL];
  };
  
  Blockly.Python["robomaster_check_condition"] = function (block) {
    return ["check_condition()", Blockly.Python.ORDER_FUNCTION_CALL];
  };
  
  Blockly.Python["robomaster_cond_wait"] = function (block) {
    return "cond_wait()\n";
  };
  
  // Deux fonctions "play_sound" dans le code Python => deux blocs distincts
  Blockly.Python["robomaster_play_sound"] = function (block) {
    return "play_sound()\n";
  };
  
  Blockly.Python["robomaster_play_sound_2"] = function (block) {
    return "play_sound()\n"; // ou "play_sound_2()" s'il existait vraiment
  };
  
  Blockly.Python["robomaster_capture"] = function (block) {
    return "capture()\n";
  };
  
  Blockly.Python["robomaster_record"] = function (block) {
    return "record()\n";
  };
  
  Blockly.Python["robomaster_say"] = function (block) {
    return "say()\n";
  };
  