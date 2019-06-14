<?php
ini_set("session.gc_maxlifetime", 725760);
session_start();
if( !empty($_SESSION['userID']) and !empty($_SESSION['userPASS']) ){
  require_once 'f/RedBean/rb-mysql.php';
  require 'f/connect.php';
  $user = R::findOne('users', 'id = "'.$_SESSION['userID'].'"');

  if( $user['password'] == $_SESSION['userPASS'] ){
    $params = R::findOne('params', 'user_id = '.$user['id']);
    $tasks = R::find('tasks', 'user_id = '.$user['id'].' ORDER BY time');
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
  <meta name="yandex-verification" content="c2fe3072d61538d3" />
  <title>Главная</title>

  <link rel="apple-touch-icon" sizes="180x180" href="img/icon/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="img/icon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="img/icon/favicon-16x16.png">
  <link rel="manifest" href="img/icon/site.webmanifest">
  <link rel="mask-icon" href="img/icon/safari-pinned-tab.svg" color="#5bbad5">
  <meta name="msapplication-TileColor" content="#da532c">
  <meta name="theme-color" content="#ffffff">

  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="css/material/material.min.css">
  <link rel="stylesheet" href="lib/iziToast.min.css">

  <script defer src="js/material/material.min.js"></script>
  <script src="js/jquery/jquery.min.js"></script>

  <script src="https://api-maps.yandex.ru/2.1/?apikey=44bdc226-eb4a-4176-aa39-82ecf27b30a8&lang=ru_RU" type="text/javascript"></script>

  <link rel="stylesheet" href="css/styles.css">
  <script src="js/map.js" charset="utf-8"></script>
  <script src="js/functions.js" charset="utf-8"></script>
  <script src="js/aes/aes.js"></script>
  <script src="lib/iziToast.min.js" charset="utf-8"></script>
  <script type="text/javascript">
    function sendCode() {
      if( checkAllFields() ){
        var mailVar = $("#mail-field").val();
        let codeVar = Math.round(Math.random() * (10000 - 1000) + 1000) + "";
        let cypher = CryptoJS.AES.encrypt(codeVar, "nwERo3Lnt0Am*GvX").toString();
        localStorage['code'] = cypher;

        $(".mdl-spinner").css("display", "block");
        $("#send-code").prop("disabled", true);

        $.post("f/send/index.php", {
          email: mailVar,
          code: codeVar
        }).done(function(){
          $(".mdl-spinner").css("display", "none");
          $("#send-code").text("Отправить");
          $("#send-code").prop("disabled", true);
          $("#send-code").attr("onclick", "sendForm();");
          if( params['darkTheme'] ){ $("#send-code").css("color", "#2C2F35"); }     else { $("#send-code").css("color", "#BDBDBD"); }

          $("#register-form").css("display", "none");
          $(".code-field").css("display", "block");

          iziToast.show({
            title: 'Сообщение успешно отправлено!',
            message: 'На указанную почту отправлено сообщение с кодом для окончания регистрации.',
            color: 'green',
            position: 'bottomRight'
          });
        }).fail(function(){
          iziToast.show({
            title: 'Ошибка при отправке сообщения!',
            message: 'Отправка сообщения не удалась в связи с неизвестной ошибкой.',
            color: 'red',
            position: 'bottomRight'
          });
        });
      }
    }
  </script>

  <!-- Yandex.Metrika counter -->
<script type="text/javascript" >
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(54029680, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true
   });
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/54029680" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->


</head>

<body>

  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <!-- Title -->
        <span class="mdl-layout-title">daily.Maps</span>
        <!-- Add spacer, to align navigation to the right -->
        <div class="mdl-layout-spacer"></div>

        <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
          <label class="mdl-button mdl-js-button mdl-button--icon" for="search">
            <i class="material-icons">search</i>
          </label>
          <div class="mdl-textfield__expandable-holder">
            <input class="mdl-textfield__input" type="text" id="search" onchange="searchTask();" onchange="searchTask();">
            <label class="mdl-textfield__label" for="sample-expandable">Search Task</label>
          </div>
        </div>

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
              <img src="img/user/<?php echo $user['img']; ?>" height="45px" id="user-img">
              <span><?php echo $user['nick']; ?></span>
              <span class="mdl-list__item-sub-title"><?php echo $user['login']; ?></span>
            </span>
          </li>
        </ul>
<?php } ?>
      </div>
      <nav class="mdl-navigation">
        <a class="mdl-navigation__link" href=""> <i class="material-icons">home</i> Главная</a>
        <a class="mdl-navigation__link" href="settings/"> <i class="material-icons">settings</i> Настройки</a>
      <?php if( !empty($_SESSION['userID']) or !empty($_SESSION['userPASS']) ){ ?>
        <hr>
        <a class="mdl-navigation__link" href="f/signout"> <i class="material-icons">exit_to_app</i> Выход</a>
      <?php } ?>
      </nav>
    </div>
    <main class="mdl-layout__content">
      <div class="page-content">

        <ul class="mdl-list" id="tasks">
          <?php
          if( !empty($tasks) ){
            $i=0;
            foreach ($tasks as $task) {
              if( !empty($task['coords_x']) and !empty($task['coords_y']) ){}
              else {
                $task['coords_x'] = undefined;
                $task['coords_y'] = undefined;
              }
              ?>
              <li class="mdl-list__item mdl-list__item--three-line list-item-<?php echo $i; ?>">
                <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="option-<?php echo $i; ?>">
                  <input type="checkbox" id="option-<?php echo $i; ?>" class="mdl-radio__button" onchange="completeTask(<?php echo $i; ?>, <?php echo $task['id']; ?>, 1);" name="options">
                  <span class="mdl-radio__label"></span>
                </label>
                <span class="mdl-list__item-primary-content">
                  <span id="task-text-<?php echo $i; ?>"><span><?php echo $task['text']; ?></span></span>
                  <span class="mdl-list__item-text-body"><?php echo substr($task['time'], 0, 5); ?> (<?php echo $task['long']; ?> минут)</span>
                </span>
                <span class="mdl-list__item-secondary-content">
                  <button id="menu-lower-right-<?php echo $i; ?>" class="mdl-button mdl-js-button mdl-button--icon">
                    <i class="material-icons">more_vert</i>
                  </button>
                  <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" for="menu-lower-right-<?php echo $i; ?>">
                    <li class="mdl-menu__item" onclick="deleteTask(<?php echo $i; ?>, <?php echo $task['id']; ?>, 1);">Удалить</li>
                    <li class="mdl-menu__item"
                        onclick="editTask(<?php echo $i; ?>, <?php echo $task['id']; ?>, 1, '<?php echo $task['text']; ?>', '<?php echo substr($task['time'], 0, 5); ?>', <?php echo $task['long']; ?>, <?php echo $task['coords_x']; ?>, <?php echo $task['coords_y']; ?>);">
                          Изменить
                        </li>
                  </ul>
                </span>
              </li>
              <?php
              if( $task['ready'] ){
                ?>
                <script type="text/javascript">
                  $("#option-<?php echo $i; ?>").prop("checked", true);
                  $("#task-text-<?php echo $i; ?>").children(":first").css("text-decoration", "line-through");
                </script>
                <?php
              }
              if( $task['coords_x'] != undefined and $task['coords_x'] != undefined ){
                ?>
                <script type="text/javascript">
                  showPlaceholder( <?php echo $i; ?>, <?php echo $task['coords_x']; ?>, <?php echo $task['coords_y']; ?>);
                  window.addEventListener('load', function() {
                    $(".build-route").css("display", "block");
                  });
                </script>
                <?php
              }
              $i++;
            }
          }
          ?>
        </ul>
        <?php if( !empty($_SESSION['userID']) and !empty($_SESSION['userPASS']) ){ ?>
          <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect show-modal add-button" onclick="$('.add-task--done').attr('onclick', 'saveTask(1);');" disabled>
        <?php }   else { ?>
          <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect show-modal add-button" onclick="$('.add-task--done').attr('onclick', 'saveTask(0);');" disabled>
        <?php } ?>
          <i class="material-icons add-button">add</i>
        </button>

        <button type="button" class="mdl-chip build-route" onclick=" location = 'map/'; ">
          <span class="mdl-chip__text">Поехали</span>
        </button>

        <dialog class="mdl-dialog add-task">

          <div class="mdl-dialog__actions">
            <?php if( empty($_SESSION['userID']) and empty($_SESSION['userPASS']) ){ ?>
            <button type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect add-task--done" onclick="saveTask(0);">
              Сохранить
            </button>
          <?php }   else { ?>
            <button type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect add-task--done" onclick="saveTask(1);">
              Сохранить
            </button>
          <?php } ?>
            <button type="button" class="mdl-button mdl-js-button mdl-button--icon add-task--close">
              <i class="material-icons">close</i>
            </button>
          </div>

          <div class="mdl-dialog__content">
            <div class="dialog-inputs">
              <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" id="taskDiv">
                <input class="mdl-textfield__input" type="text" id="task">
                <label class="mdl-textfield__label" for="task" id="taskLabel">Текст задания</label>
              </div>

              <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
                <label class="mdl-button mdl-js-button mdl-button--icon" id="timeLabel" for="time">
                  <i class="material-icons">schedule</i>
                </label>
                <div class="mdl-textfield__expandable-holder">
                  <input class="mdl-textfield__input" type="time" id="time" value="12:00">
                </div>
              </div><br>
              <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input class="mdl-textfield__input" type="number" id="long" value="15">
                <label class="mdl-textfield__label" id="longLabel" for="long">Время выполнения (минуты)</label>
              </div>
            </div>

            <div id="map" class="choosePlace"></div>

          </div>
        </dialog>

        <!--_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-->
<?php if( empty($_SESSION['userID']) and empty($_SESSION['userPASS']) ){ ?>
        <dialog class="mdl-dialog login-dialog">
          <h4 class="mdl-dialog__title">Авторизация </h4>
          <div class="mdl-dialog__content" id="log-dialog-content">

            <form action="f/login/" method="post" id="login-form">
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

            <form action="f/register/" method="post" id="register-form">
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

  <script src="js/index.js" charset="utf-8"></script>
  <script src="https://yastatic.net/browser-updater/v1/script.js" charset="utf-8"></script>
  <script>
    var yaBrowserUpdater = new ya.browserUpdater.init({
      "lang":"ru",
      "browsers":{
        "yabrowser":"16.12",
        "chrome":"62",
        "ie":"Infinity",
        "opera":"49",
        "safari":"9.1",
        "fx":"Infinity",
        "iron":"35",
        "flock":"Infinity",
        "palemoon":"Infinity",
        "camino":"Infinity",
        "maxthon":"4.5",
        "seamonkey":"Infinity"
      },
      "theme":"blue"
    });
  </script>
</body>
</html>

<script type="text/javascript">
  if ( params["darkTheme"]) {
    darkness();
  }
  alertResult( <?php echo $_SESSION['request_result']; $_SESSION['request_result'] = 0; ?> );
</script>

<?php
if( count($tasks) == 0 ){
?>
    <script type="text/javascript">
      if( localStorage.getItem('count') == null || localStorage.getItem('count') == 0 ){
        noTasks();
      }
    </script>
  <?php
}   if( $params['dark_theme'] ){
?>
  <script type="text/javascript">
    darkness();
  </script>
<?php
}
?>
