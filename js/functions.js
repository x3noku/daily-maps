var params, editElement, inp, res, counter = 0, coordsExist, coords;
var colorElements = [".mdl-layout__content", ".mdl-layout__header", ".mdl-layout__drawer",
".mdl-dialog__actions", ".mdl-list__item-secondary-action", ".mdl-radio", ".mdl-menu",
".build-route", ".add-task", ".register-dialog", ".login-dialog", ".template-dialog", ".add-button",
".add-task--close", ".add-task--done", ".show-password", "#task", "#time", "#long", "#taskLabel",
"#timeLabel", "#longLabel", "#mail-field", "#password-field", "#pass-field", "#code-field",
"#login-field", "#parole-field", "#mail-field-label", "#password-field-label", "#pass-field-label",
"#code-field-label", "#login-field-label", "#parole-field-label", ".select-option"];

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

tasks = JSON.parse(localStorage.getItem("tasks"));

function resizeMap() {
  var mapHeight = $(".add-task").height() - $(".mdl-dialog__actions").height() - $(".dialog-inputs").height() - 54;
  var marginBuild = ( $("body").width() - $(".build-route").width() ) / 2;
  var marginImgLeft = ( $("body").width() - $("#box-img").width() ) / 2;
  var marginImgTop = ( $(".mdl-layout__content").height() - $("#empty-box").height() ) / 2;
  $(".choosePlace").height(mapHeight);
  $(".choosePlace").children("ymaps").height(mapHeight);
  $(".choosePlace").children("ymaps").children("ymaps").height(mapHeight);
  $(".build-route").css("margin-left", marginBuild+"px");
  $("#empty-box").css("margin-left", marginImgLeft+"px");
  $("#empty-box").css("margin-top", marginImgTop+"px");
  $("#empty-box").css("display", "block");
}

function searchTask() {
  let length = $("#tasks").children("li").length;
  let result = 0;
  let search = $("#search").val();
  let reg = new RegExp( search, "i");

  for(i=0; i<length; i++) {
    let text = $("ul#tasks").children("li.list-item-"+i).children(".mdl-list__item-primary-content").children("#task-text-"+i).text();
    if( text.search(reg) == -1 ){
      $(".list-item-"+i).hide(800);
    }
    else {
      $(".list-item-"+i).show(800);
      result++;
    }
  }

  if(result == 0){
    iziToast.show({
      title: 'Пусто!',
      message: 'По данному запросу ничего не найдено.',
      color: 'blue',
      position: 'topCenter'
    });
  }
}

function darkness() {
  colorElements.forEach(function(item) {
    $(item).addClass("dark");
  });
  $("h5").css("color", "#BABDC4");
  $("span").css("color", "#BABDC4");
  $("a").css("color", "#BABDC4");
  $(".address-line").css("color", "#999999");
  $("#show-register-dialog").css("border-bottom", "1px dotted");
  $("#box-img").prop("src", "img/empty-box-dark-true.png");
  $("*#placeholder").prop("src", "img/placeholder-dark-true.png");
  $("#switch-theme").prop("checked", true);
}

window.onload = function() {
  if( params['darkTheme'] ){
    darkness();
  }
  if( params['leeway'] || params['transport'] ){
    $(".leeway-option-"+params['leeway']).prop("selected", true);
    $(".transport-option-"+params['transport']).prop("selected", true);
  }
}

function noTasks() {
  $(".page-content").append(" <div id='empty-box' style='display: none;'> <img src='img/empty-box-dark-false.png' height='120px' width='120px' id='box-img'> <h5 style='margin-top: 2px;'>Заданий нет.</h5> </div> ");
}

function completeTask (x, id, authorized) {
  if( authorized ){
    if ($("#option-" + x).is(":checked")) {
      $("#task-text-" + x).children(":first").css("text-decoration", "line-through");
      $.post("f/change/tasks/completeTask.php", {
        id: id,
        completed: 1
      });
    }
    else {
      $("#task-text-" + x).children(":first").css("text-decoration", "none");
      $.post("f/change/tasks/completeTask.php", {
        id: id,
        completed: 0
      });
    }
  }
  else{
    if ($("#option-" + x).is(":checked")) {
      $("#task-text-" + x).children(":first").css("text-decoration", "line-through");
      tasks["ready"][x] = 1;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } else {
      $("#task-text-" + x).children(":first").css("text-decoration", "none");
      tasks["ready"][x] = 0;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }
}

function deleteTask (x, id, authorized) {
  if( authorized ){
    $.post("f/change/tasks/deleteTask.php", {
      id: id
    });
    $(".list-item-"+x).hide('slow', function(){
       $(this).remove();
       location.reload();
     });
  }
  else {
    tasks["coordinates"].splice(x, 1);
    tasks["text"].splice(x, 1);
    tasks["time"].splice(x, 1);
    tasks["long"].splice(x, 1);
    tasks["ready"].splice(x, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage["count"] -= 1;

    coordsExist = false
    tasks["coordinates"].forEach(function(item) {
      if( item !=null ){
        coordsExist = true;
      }
    });

    $(".list-item-"+x).hide('slow', function(){
       $(this).remove();
       if( !coordsExist ){
         $(".build-route").hide('slow', function(){
            $(this).remove(); location.reload();
          });
       }
       else {
         location.reload();
       }
     });

  }
}

function editTask (x, id, authorized, text, time, long, coords_x, coords_y) {
  if( authorized ){
    dialogMap.showModal();
    resizeMap();

    $("#task").val(text);
    $("#taskDiv").addClass("is-dirty");
    $("#time").val(time);
    $("#long").val(long);
    $(".add-task--done").attr("onclick", "saveTask(1, "+id+");");

    if( coords_x != null && coords_y != null ){
      myMap.setCenter([coords_x, coords_y]);
      myPlacemark = new ymaps.Placemark([coords_x, coords_y]);
      myCollection.add(myPlacemark);
      myMap.geoObjects.add(myCollection);
      coords = [coords_x, coords_y];
    } else {
      myMap.setCenter(userCoordinates);
    }

  }
  else {
    dialogMap.showModal();
    resizeMap();

    $("#task").val(tasks["text"][x]);
    $("#taskDiv").addClass("is-dirty");
    $("#time").val(tasks["time"][x]);
    $("#long").val(tasks["long"][x]);

    saveAction = 'edit';
    editElement = x;
    coords = tasks["coordinates"][x];

    if( coords[0] != null && coords[1] != null ){
      myMap.setCenter(coords);
      myPlacemark = new ymaps.Placemark(coords);
      myCollection.add(myPlacemark);
      myMap.geoObjects.add(myCollection);
    } else {
      myMap.setCenter(userCoordinates);
    }
  }
}

function saveTask( authorized, id ) {

  if( !coords ){
    coords = [null, null];
  }

  if( authorized && $("#task").val().replace("'", "").replace('"', '') ){
    $(".add-task--done").prop("disabled", true);
    if( id == undefined ){
      $.post("f/change/tasks/addTask.php", {
        text: $("#task").val().replace("'", "").replace('"', ''),
        time: $("#time").val(),
        long: $("#long").val(),
        coords_x: coords[0],
        coords_y: coords[1]
      }).done(function(){
        location.reload();
      });
    }
    else {
        $(".add-task--done").prop("disabled", true);
        $.post("f/change/tasks/editTask.php", {
          id: id,
          text: $("#task").val().replace("'", "").replace('"', ''),
          time: $("#time").val(),
          long: $("#long").val(),
          coords_x: coords[0],
          coords_y: coords[1]
        }).done(function(){
          location.reload();
        });
    }
  }
  else {
    if ($("#task").val().replace("'", "").replace('"', '') && $("#time").val() ) {
      $(".add-task--done").prop("disabled", true);
      if (saveAction == 'create') {
        tasks["coordinates"][i] = coords;
        tasks["text"][i] = $("#task").val().replace("'", "").replace('"', '');
        tasks["time"][i] = $("#time").val();
        tasks["long"][i] = $("#long").val();
        tasks["ready"][i] = 0;

        var pos = 0;
        for( j=0; j<i; j++ ){
          let myTime = toMinutes($("#time").val().split(':'));
          let thisTime = toMinutes(tasks["time"][j].split(':'));

          if( myTime < thisTime && thisTime != null ){
              pos = j;
              for(let k=i; k>pos; k--){
                tasks["coordinates"][k] = tasks["coordinates"][k-1];
                tasks["text"][k] = tasks["text"][k-1];
                tasks["time"][k] = tasks["time"][k-1];
                tasks["long"][k] = tasks["long"][k-1];
                tasks["ready"][k] = tasks["ready"][k-1];
              }
              tasks["coordinates"][pos] = coords;
              tasks["text"][pos] = $("#task").val().replace("'", "").replace('"', '');
              tasks["time"][pos] = $("#time").val();
              tasks["long"][pos] = $("#long").val();
              tasks["ready"][pos] = 0;
              break;
          }
        }

        localStorage.setItem("tasks", JSON.stringify(tasks));
        i++;
        localStorage.setItem("count", i);

      }
      else if(saveAction == 'edit'){
        $(".add-task--done").prop("disabled", true);
        tasks["coordinates"].splice(editElement, 1);
        tasks["text"].splice(editElement, 1);
        tasks["time"].splice(editElement, 1);
        tasks["long"].splice(editElement, 1);
        tasks["ready"].splice(editElement, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        localStorage["count"] -= 1;
        i--;
        tasks["coordinates"][i] = coords;
        tasks["text"][i] = $("#task").val().replace("'", "").replace('"', '');
        tasks["time"][i] = $("#time").val();
        tasks["long"][i] = $("#long").val();
        tasks["ready"][i] = 0;

        var pos = 0;
        for( j=0; j<i; j++ ){
          let myTime = $("#time").val().split(':');   myTime = myTime[0]*60 + myTime[1];
          let thisTime = tasks["time"][j].split(':');   thisTime = thisTime[0]*60 + thisTime[1];

          if( myTime < thisTime && thisTime != null ){
              pos = j;
              for(let k=i; k>pos; k--){
                tasks["coordinates"][k] = tasks["coordinates"][k-1];
                tasks["text"][k] = tasks["text"][k-1];
                tasks["time"][k] = tasks["time"][k-1];
                tasks["long"][k] = tasks["long"][k-1];
                tasks["ready"][k] = tasks["ready"][k-1];
              }
              tasks["coordinates"][pos] = coords;
              tasks["text"][pos] = $("#task").val().replace("'", "").replace('"', '');
              tasks["time"][pos] = $("#time").val();
              tasks["long"][pos] = $("#long").val();
              tasks["ready"][pos] = 0;
              break;
          }
        }

        localStorage.setItem("tasks", JSON.stringify(tasks));
        i++;
        localStorage.setItem("count", i);

      }
      window.location.reload();
    }
    else if( $("#task").val().replace("'", "").replace('"', '') && !$("#time").val() ){
      tasks["coordinates"].unshift( coords );
      tasks["text"].unshift( $("#task").val().replace("'", "").replace('"', '') );
      tasks["time"].unshift( $("#time").val() );
      tasks["long"].unshift( $("#long").val() );
      tasks["ready"].unshift( 0 );

      localStorage.setItem("tasks", JSON.stringify(tasks));
      i++;
      localStorage.setItem("count", i);

      window.location.reload();
    }
  }
}

function showPlaceholder(x, coords_x, coords_y){
  $("#task-text-" + x).append("<img src='img/placeholder-dark-false.png' id='placeholder' height='18px' height='18px' style='padding:0px 0px 5px 10px;'> ");
ymaps.ready(function(){
    ymaps.geocode([coords_x, coords_y], { results: 1 })
    .then(function (res) {
      var firstGeoObject = res.geoObjects.get(0);
      /*console.log('Все данные геообъекта: ', firstGeoObject.properties.getAll());
       *console.log('Название объекта: %s', firstGeoObject.properties.get('name'));
       *console.log('Полное описание объекта: %s', firstGeoObject.properties.get('text'));
       *console.log('Адрес объекта: %s', firstGeoObject.getAddressLine());
       */
      $("#task-text-" + x).append("<span class='address-line'>" + firstGeoObject.properties.get('name') + "</span>");
    });
});
}

function switchTheme( authorized ) {
  if( authorized ){
    $.post("../f/change/params/changeTheme.php").done(function(){
      window.location.reload();
    });
  }
  else {
    if ($("#switch-theme").is(":checked")) {
      params["darkTheme"] = true;
      localStorage.setItem("params", JSON.stringify(params));
    } else {
      params["darkTheme"] = false;
      localStorage.setItem("params", JSON.stringify(params));
    }
    localStorage.setItem("changes", true);
    location.reload();
  }
}

function changeLeeway( authorized ) {
  if( authorized ){
    $.post("../f/change/params/changeLeeway.php", {
      leeway: $(".leeway-field").val() * 1
    });
  }
  else {
    params["leeway"] = $(".leeway-field").val() * 1;
    localStorage.setItem("params", JSON.stringify(params));
    localStorage.setItem("changes", true);
  }
}

function changeTransport( authorized ) {
  if( authorized ){
    $.post("../f/change/params/changeTransport.php", {
      transport: $(".transport-field").val()
    });
  }
  else {
    params["transport"] = $(".transport-field").val();
    localStorage.setItem("params", JSON.stringify(params));
    localStorage.setItem("changes", true);
  }
}

function showPassword() {
  if( ++counter%2 ){
    $(".show-password").text("visibility_off");
    $("#password-field").attr("type", "text");
    $("#pass-field").attr("type", "text");
  }
  else {
    $(".show-password").text("visibility");
    $("#password-field").attr("type", "password");
    $("#pass-field").attr("type", "password");
  }
}

function checkAllFields() {
  let mailCorrect = 1;
  let err = '';

  let email = $("#mail-field").val();
  let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let password = $("#password-field").val();
  let pass = $("#pass-field").val();

  if( !re.test(email) ){
    mailCorrect = 0;
    setTimeout(function() {
        $("#mail-field-div").addClass("is-invalid");
    }, 10);
  }

  if( password != pass ){
    err = 'Пароли не совпадают!';
    correct = 0;
  }
  if( !($("#mail-field").is(":focus")) && !password.length && password == pass ){
      err = 'Заполните поле пароля!';
      correct = 0;
  }

  if( mailCorrect && password == pass && password.length ){
    $("#send-code").text("Зарегестрироваться");
    $("#send-code").prop("disabled", false);
    $("#send-code").css("color", "#000000");

    return( true );
  }
  else {
    $("#send-code").prop("disabled", true);
    if( err != '' ){
      $("#send-code").text( err );
      $("#send-code").css("color", "#D50000");
    }
    else{
      $("#send-code").text("Зарегестрироваться");
      if( params['darkTheme'] ){
        $("#send-code").css("color", "#2C2F35");
      }
      else {
        $("#send-code").css("color", "#BDBDBD");
      }
    }

    return( false );
  }
}

function checkCode() {
  let code = $("#code-field").val();
  let decrypted = CryptoJS.AES.decrypt( localStorage['code'] , "nwERo3Lnt0Am*GvX").toString(CryptoJS.enc.Utf8);
  if( checkAllFields() ){
    if( code == decrypted ){
      $("#send-code").text("Отправить");
      $("#send-code").prop("disabled", false);
      $("#send-code").css("color", "#000000");

      return true;
    }
    else {
      $("#send-code").prop("disabled", true);
      $("#send-code").text("Введенный код неверен");
      $("#send-code").css("color", "#D50000");
      return false;
    }
  }
}

function sendForm() {
  if( checkAllFields() && checkCode() ){
    $("#register-form").trigger("submit");
  }
}

function logIn() {

  if( $("#login-field").val() && $("#parole-field").val() ){
    $("#login-form").trigger("submit");
  }
  else if( $("#login-field").val() && !$("#parole-field").val() ) {
    $("#parole-field-div").addClass("is-invalid");
  }
  else if( !$("#login-field").val() && $("#parole-field").val() ) {
    $("#login-field-div").addClass("is-invalid");
  }
  else {
    $("#login-field-div").addClass("is-invalid");
    $("#parole-field-div").addClass("is-invalid");
  }

}

function focusOnInput(e) {
  switch(e){
    case 'focus':
        $(".dialog-inputs").hide("slow", function() {
          inputHeights = window.inputHeights = $(".dialog-inputs").height();
          $(".dialog-inputs").height(0);
          resizeMap();
        });
        break;

    case 'blur':
        $(".dialog-inputs").height(inputHeights);
        resizeMap();
        $(".dialog-inputs").show("slow");
        break;
  }
}

function alertResult( res ) {
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
    if( res == '200' ) {
      iziToast.show({
        title: 'Ура!',
        message: 'Вы успешно авторизировались.',
        color: 'green',
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        position: 'bottomRight'
      });
    }
    else if( res == '201' ){
      iziToast.show({
        title: 'Это победа!',
        message: 'Вы были зарегестрированы на сайте.',
        color: 'green',
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        position: 'bottomRight'
      });
      setTimeout( function(){
        iziToast.show({
          title: 'Синхронизация завершена!',
          message: 'Все ваши данные были синхронизированы.',
          color: 'blue',
          transitionIn: 'flipInX',
          transitionOut: 'flipOutX',
          position: 'bottomRight'
        });
      }, 2000 );
    }
    else if( res == '400.0' ) {
      iziToast.show({
        title: 'Ошибка при регистрации!',
        message: 'Указанная почта имеет неверный формат.',
        color: 'red',
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        position: 'bottomRight'
      });
    }
    else if( res == '400.1' ) {
      iziToast.show({
        title: 'Ошибка при регистрации!',
        message: 'Введённые пароли не совпадают.',
        color: 'red',
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        position: 'bottomRight'
      });
    }
    else if( res == '400.2' ) {
      iziToast.show({
        title: 'Ошибка при регистрации!',
        message: 'Указанная почта имеет неверный формат, введённые пароли не совпадают.',
        color: 'red',
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        position: 'bottomRight'
      });
    }
    else if( res == '400.3' ) {
      iziToast.show({
        title: 'Ошибка при регистрации!',
        message: 'Данная почта уже занята другим пользователем, укажите другую почту.',
        color: 'red',
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        position: 'bottomRight'
      });
    }
    else if( res == '400.4' ) {
      iziToast.show({
        title: 'Ошибка при авторизации!',
        message: 'Пользователя с такой почтой не существует, проверьте правильность введённых данных.',
        color: 'red',
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        position: 'bottomRight'
      });
    }
    else if( res == '400.5' ) {
      iziToast.show({
        title: 'Ошибка при авторизации!',
        message: 'Введённый пароль неверен, проверьте правильность введённых данных.',
        color: 'red',
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        position: 'bottomRight'
      });
    }
}

function toMinutes( time ){
  return parseInt(time[0] * 60 + time[1] * 1);
}

function toHours( time ) {
  if( time/60 >= 10 ){
    if( time%60 == 0 ){
      return parseInt(time/60) + ":00";
    }
    else if( time%60 >= 10 ){
      return parseInt(time/60) + ":" + time%60;
    }
    else {
      return parseInt(time/60) + ":0" + time%60;
    }
  }
  else {
    if( time%60 == 0 ){
      return "0"+parseInt(time/60) + ":00";
    }
    else if( time%60 >= 10 ){
      return "0"+parseInt(time/60) + ":" + time%60;
    }
    else {
      return "0"+parseInt(time/60) + ":0" + time%60;
    }
  }
}
