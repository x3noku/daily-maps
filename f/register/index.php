<?php
ini_set("session.gc_maxlifetime", 725760);
session_start();
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width = device-width">
    <title>Регистрация</title>

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
          "leeway": 10,
          "taskTime": 15,
          "transport": "masstransit"
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

function isValidEmail($email){
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

$data = $_POST;

$mail = $data['mail-field'];
$password = $data['password-field'];
$pass = $data['pass-field'];
$nickname = explode('@', $mail);
$nickname =  str_replace('.', " ", $nickname[0]);
$existUser = count( R::find('users', 'login = "'.$mail.'"') );

if( isValidEmail($mail) and $password == $pass and !$existUser ){

  $user = R::dispense('users');
  $user->login = $mail;
  $user->password = md5(sha1( $password ));
  $user->nick = $nickname;
  $user->img = 'user.svg';
  $id = R::store($user);

  $user = R::findOne( 'users', 'id = '.$id);
  $_SESSION['userID'] = $id;
  $_SESSION['userPASS'] = $user['password'];
  $_SESSION['request_result'] = 200;
  ?>
    <script type="text/javascript">
      if( localStorage.getItem('count') > 0 ){
        for(var i=0, len=localStorage.getItem('count'); i<len; i++ ){
          $.post("../sync/index.php",
          {
            tasks: localStorage.getItem('tasks'),
            counter: i
          });
        }
      }
      $.post("../sync/params.php", { params: JSON.stringify(params) });
      localStorage.clear();
      window.location.href = '../../';
    </script>
  <?php
}
else {
  /*
   * Error 400.0 - Invalid Email
   * Error 400.1 - Passwords Aren't Equal
   * Error 400.2 - Invalid Email and Passwords Aren't Equal
   * Error 400.3 - User Already Exist
   * Error 400.4 - User Doesn't Exists
   * Error 400.5 - Enterd Password Doesn't Equal to User's Password
   * Result 200 - User Has Successfuly Authorized
   * Result 201 - User Has Successfuly Registered
   */
  if( !isValidEmail($mail) and $password == $pass and !$existUser ) {
    $_SESSION['request_result'] = 400.0;
  }
  elseif( isValidEmail($mail) and $password != $pass and !$existUser ) {
    $_SESSION['request_result'] = 400.1;
  }
  elseif( !isValidEmail($mail) and $password != $pass and !$existUser ) {
    $_SESSION['request_result'] = 400.2;
  }
  elseif( $existUser ){
    $_SESSION['request_result'] = 400.3;
  }
  ?>
  <script type="text/javascript">
    window.location.href = '../../';
  </script>
  <?php
}

?>
