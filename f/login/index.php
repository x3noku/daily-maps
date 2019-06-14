<?php 
ini_set("session.gc_maxlifetime", 725760);
session_start(); 
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width = device-width">
    <title>Авторизация</title>

    <link rel="apple-touch-icon" sizes="180x180" href="../../img/icon/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="../../img/icon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../../img/icon/favicon-16x16.png">
    <link rel="manifest" href="../../img/icon/site.webmanifest">
    <link rel="mask-icon" href="../../img/icon/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">

    <link rel="stylesheet" href="../../css/material/material.min.css">
    <script defer src="../../js/material/material.min.js"></script>
    <script src="../../js/jquery/jquery.min.js"></script>
    <script type="text/javascript">
      if (localStorage.getItem("changes")) {
        params = JSON.parse(localStorage.getItem("params"));
      } else {
        params = {
          "darkTheme": false,
          "leeway": 5,
          "taskTime": 15
        };
      }

    </script>

    <style media="screen">
      body {
        display: flex;
        justify-content: center; /*Центрирование по горизонтали*/
        align-items: center;     /*Центрирование по вертикали */
      }
      .mdl-spinner {
        width: 100px;
        height: 100px;
      }
    </style>

  </head>
  <body>

    <div class="mdl-spinner mdl-js-spinner is-active" id = "mdl-spinner"></div>

    <script type="text/javascript">
      if( params['darkTheme'] ){
        $("body").css("background-color", "#3C4048");
      }
    </script>

  </body>
</html>

<?php

require_once '../RedBean/rb-mysql.php';
require '../connect.php';

$data = $_POST;

$login = $data['login-field'];
$password = md5(sha1( $data['parole-field'] ));
$user = R::findOne( 'users', 'login = "'.$login.'"');

if( $user != NULL ){
  if( $user['password'] == $password ){
    $_SESSION['userID'] = $user['id'];
    $_SESSION['userPASS'] = $user['password'];
    $_SESSION['request_result'] = 200;
    ?>
      <script type="text/javascript">
        localStorage.clear();
        window.location.href = '../../';
      </script>
    <?php
  }
  else {
    $_SESSION['request_result'] = 400.5;
    ?>
      <script type="text/javascript">
        window.location.href = '../../';
      </script>
    <?php
  }
}
else {
  $_SESSION['request_result'] = 400.4;
  ?>
    <script type="text/javascript">
      window.location.href = '../../';
    </script>
  <?php
}

?>
