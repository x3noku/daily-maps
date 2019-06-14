<?php
session_start();
if( !empty($_SESSION['userID']) and !empty($_SESSION['userPASS']) ){
  require_once '../f/RedBean/rb-mysql.php';
  require '../f/connect.php';
  $user = R::findOne('users', 'id = "'.$_SESSION['userID'].'"');

  if( $user['password'] == $_SESSION['userPASS'] ){
    $params = R::findOne('params', 'user_id = '.$user['id']);
    $tasks = R::find('tasks', 'user_id = '.$user['id']);
  }
  else {
    session_unset();
    header("Refresh:0");
  }
}

?>
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>

  <meta charset="UTF-8">
  <meta name="viewport" content="width = device-width">
  <title>Мои Маршруты</title>

  <link rel="apple-touch-icon" sizes="180x180" href="../img/icon/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="../img/icon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="../img/icon/favicon-16x16.png">
  <link rel="manifest" href="../img/icon/site.webmanifest">
  <link rel="mask-icon" href="../img/icon/safari-pinned-tab.svg" color="#5bbad5">
  <meta name="msapplication-TileColor" content="#da532c">
  <meta name="theme-color" content="#ffffff">

  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="../css/material/material.min.css">
  <link rel="stylesheet" href="../lib/iziToast.min.css">

  <script defer src="../js/material/material.min.js"></script>
  <script src="../js/jquery/jquery.min.js"></script>

  <!--<script src="https://api-maps.yandex.ru/2.1/?apikey=44bdc226-eb4a-4176-aa39-82ecf27b30a8&lang=ru_RU" type="text/javascript"></script>-->

  <link rel="stylesheet" href="../css/styles.css">
  <!--<script src="../js/map.js" charset="utf-8"></script>-->
  <script src="../js/functions.js" charset="utf-8"></script>
  <!--<script src="../js/aes/aes.js"></script>-->
  <script src="../lib/iziToast.min.js" charset="utf-8"></script>

</head>

<body>

  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <!-- Title -->
        <span class="mdl-layout-title">daily.Maps</span>
        <!-- Add spacer, to align navigation to the right -->
        <div class="mdl-layout-spacer"></div>

      </div>
    </header>
    <div class="mdl-layout__drawer">
      <div class="mdl-layout-title" id="sign-section">
<?php if( empty($_SESSION['userID']) and empty($_SESSION['userPASS']) ){ ?>
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect register-btn show-login-dialog">Войти</button><br>
        <span class="register-link"> Ещё не <a class="show-register-dialog" id="show-register-dialog">зарегестрированы?</a> </span>
        <div class="mdl-tooltip" data-mdl-for="show-register-dialog">
          <big> Нажмите для регистрации </big>
        </div>
<?php }   else { ?>
        <ul class="demo-list-two mdl-list" id="user-info-ul">
          <li class="mdl-list__item mdl-list__item--two-line" id="user-info-li">
            <span class="mdl-list__item-primary-content">
              <img src="../img/user/<?php echo $user['img']; ?>" height="45px" id="user-img">
              <span><?php echo $user['nick']; ?></span>
              <span class="mdl-list__item-sub-title"><?php echo $user['login']; ?></span>
            </span>
          </li>
        </ul>
<?php } ?>
      </div>
      <nav class="mdl-navigation">
        <a class="mdl-navigation__link" href="../"> <i class="material-icons">home</i> Главная</a>
        <a class="mdl-navigation__link" href="../settings/"> <i class="material-icons">settings</i> Настройки</a>
      <?php if( !empty($_SESSION['userID']) or !empty($_SESSION['userPASS']) ){ ?>
        <hr>
        <a class="mdl-navigation__link" href="../f/signout"> <i class="material-icons">exit_to_app</i> Выход</a>
      <?php } ?>
      </nav>
    </div>
    <main class="mdl-layout__content">
      <div class="page-content">


        <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect show-template-dialog add-button">
          <i class="material-icons add-button">add</i>
        </button>

        <dialog class="mdl-dialog template-dialog">
          <h4 class="mdl-dialog__title">Добавить шаблон</h4>
          <div class="mdl-dialog__content" id="template-dialog-content">

          </div>
          <div class="mdl-dialog__actions">
            <button class="mdl-button">Добавить</button>
            <button class="mdl-button template-dialog--close" id="template-dialog--close">Отмена</button>
          </div>
        </dialog>

        <!--_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-->
<?php if( empty($_SESSION['userID']) and empty($_SESSION['userPASS']) ){ ?>
        <dialog class="mdl-dialog login-dialog">
          <h4 class="mdl-dialog__title">Авторизация </h4>
          <div class="mdl-dialog__content" id="log-dialog-content">

            <form action="../f/login/" method="post" id="login-form">
              <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" id="login-field-div">
                <input class="mdl-textfield__input" type="email" id="login-field" name="login-field" autocomplete="off">
                <label class="mdl-textfield__label" for="login-field" id="login-field-label">Электронная почта</label>
              </div>

              <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" id="parole-field-div">
                <input class="mdl-textfield__input" type="password" id="parole-field" name="parole-field" autocomplete="off">
                <label class="mdl-textfield__label" for="parole-field" id="parole-field-label">Пароль</label>
              </div>
            </form>
          </div>
          <div class="mdl-dialog__actions">
            <button class="mdl-button" onclick="logIn();"> Войти </button>
            <button class="mdl-button login-dialog--close" id="login-dialog--close">Отмена</button>
          </div>
        </dialog>

        <!--_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-->

        <dialog class="mdl-dialog register-dialog">
          <h4 class="mdl-dialog__title">Регистация </h4>
          <div class="mdl-dialog__content" id="reg-dialog-content">

            <form action="../f/register/" method="post" id="register-form">
              <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" id="mail-field-div">
                <input class="mdl-textfield__input" type="email" id="mail-field" name="mail-field" oninput=" checkAllFields(); " autocomplete="off">
                <label class="mdl-textfield__label" for="mail-field" id="mail-field-label">Электронная почта</label>
              </div>

              <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" id="password-field-div">
                <input class="mdl-textfield__input" type="password" id="password-field" name="password-field" oninput=" checkAllFields(); " autocomplete="off">
                <label class="mdl-textfield__label" for="password-field" id="password-field-label">Пароль</label>
              </div>
              <i class="material-icons show-password" onclick="showPassword();">visibility</i>

              <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label pass-field" id="pass-field-div">
                <input class="mdl-textfield__input" type="password" id="pass-field" name="pass-field" oninput=" checkAllFields(); " autocomplete="off">
                <label class="mdl-textfield__label" for="pass-field" id="pass-field-label">Подтвердите пароль</label>
              </div>

            </form>
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label code-field">
              <input class="mdl-textfield__input" type="number" maxlength="4" id="code-field" oninput=" checkCode();" autocomplete="off">
              <label class="mdl-textfield__label" for="code-field" id="code-field-label">Код из сообщения</label>
            </div>

          </div>
          <div class="mdl-dialog__actions">
            <button class="mdl-button" onclick="sendCode();" id="send-code" disabled> Зарегестрироваться </button>
            <button class="mdl-button register-dialog--close" id="register-dialog--close">Отмена</button>
            <div class="mdl-spinner mdl-js-spinner is-active"></div>
          </div>
        </dialog>
<?php } ?>


      </div>
    </main>
  </div>

  <script src="../js/index.js" charset="utf-8"></script>
  <script src="../js/templates.js" charset="utf-8"></script>
</body>

</html>
<script type="text/javascript">
  if ( params["darkTheme"]) {
    darkness();
  }
</script>
<?php
if( $params['dark_theme'] ){
?>
  <script type="text/javascript">
    darkness();
  </script>
<?php
}
?>
