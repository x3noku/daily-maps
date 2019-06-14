<?php
ini_set("session.gc_maxlifetime", 725760);
session_start(); 

require_once '../RedBean/rb-mysql.php';
require '../connect.php';

$data = $_POST;
$tasks = json_decode( $data['tasks'], true );
$i = (int)$data['counter'];

  $task = R::dispense('tasks');

  $task->user_id = $_SESSION['userID'];
  $task->text = $tasks['text'][$i];
  $task->time = $tasks['time'][$i];
  $task->long = $tasks['long'][$i];
  $task->coords_x = $tasks['coordinates'][$i][0];
  $task->coords_y = $tasks['coordinates'][$i][1];
  $task->ready = $tasks['ready'][$i];

  R::store($task);

?>
