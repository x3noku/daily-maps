<?php
ini_set("session.gc_maxlifetime", 725760);
session_start(); 
require_once '../../RedBean/rb-mysql.php';
require '../../connect.php';

if( !empty($_SESSION['userID']) and !empty($_SESSION['userPASS']) ){
  $user = R::findOne('users', 'id = "'.$_SESSION['userID'].'"');
  if( $user['password'] == $_SESSION['userPASS'] ){
    $data = $_POST;
    $text = $data['text'];
    $time = $data['time'];
    $long = $data['long'];
    $x = $data['coords_x'];
    $y = $data['coords_y'];

    $task = R::dispense('tasks');

    $task->user_id = $user['id'];
    $task->text = $text;
    $task->time = $time;
    $task->long = $long;
    $task->coords_x = $x;
    $task->coords_y = $y;
    $task->ready = 0;

    R::store($task);
  }
  else {
    session_unset();
    ?>
    <script type="text/javascript">
      window.location.href = '../../../';
    </script>
    <?php
  }

}

?>
