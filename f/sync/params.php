<?php
ini_set("session.gc_maxlifetime", 725760);
session_start(); 

require_once '../RedBean/rb-mysql.php';
require '../connect.php';

$data = $_POST;
$params = json_decode( $data['params'], true );


  $parametr = R::dispense('params');

  $parametr->user_id = $_SESSION['userID'];
  $parametr->dark_theme = $params['darkTheme'];
  $parametr->leeway = $params['leeway'];
  $parametr->task_time = $params['taskTime'];
  $parametr->transport = $params['transport'];

  R::store($parametr);

?>
