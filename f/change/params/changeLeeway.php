<?php
ini_set("session.gc_maxlifetime", 725760);
session_start(); 
require_once '../../RedBean/rb-mysql.php';
require '../../connect.php';
if( !empty($_SESSION['userID']) and !empty($_SESSION['userPASS']) ){
  $user = R::findOne('users', 'id = "'.$_SESSION['userID'].'"');

  if( $user['password'] == $_SESSION['userPASS'] ){
    $data = $_POST;
    $leeway = $data['leeway'];
    $settings = R::findOne('params', 'user_id = '.$user['id']);
    $id = $settings['id'];
    $params = R::load('params', $id);

    $params->leeway = $leeway;
    R::store($params);

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
