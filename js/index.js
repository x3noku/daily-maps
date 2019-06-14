var i, j, tasks, params, coords, coordsExist = false, saveAction;

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

if (localStorage.getItem("count")) {
  i = localStorage.getItem("count");
  tasks = JSON.parse(localStorage.getItem("tasks"));

  for (j = 0; j < i; j++) {
    $("#tasks").append('<li class="mdl-list__item mdl-list__item--three-line list-item-' + j + '"> <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="option-' + j + '"><input type="checkbox" id="option-' + j + '" class="mdl-radio__button" onchange="completeTask(' + j + ', 0);" name="options"><span class="mdl-radio__label"></span></label> <span class="mdl-list__item-primary-content"> <span id="task-text-'+j+'"><span>' + tasks["text"][j] + '</span></span> <span class="mdl-list__item-text-body">' + (tasks["time"][j] ? tasks["time"][j] : "Не указано ") + '(' + tasks["long"][j] + ' минут) </span>' + '</span> <span class="mdl-list__item-secondary-content"> <button id="menu-lower-right-'+j+'" class="mdl-button mdl-js-button mdl-button--icon"> <i class="material-icons">more_vert</i> </button> <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" for="menu-lower-right-'+j+'"><li class="mdl-menu__item" onclick="deleteTask('+j+');">Удалить</li><li class="mdl-menu__item" onclick="editTask('+j+');">Изменить</li></ul> </span> </li>');
    if (tasks["ready"][j]) {
      $("#option-" + j).prop("checked", true);
      $("#task-text-" + j).children(":first").css("text-decoration", "line-through");
    }
    if( tasks["coordinates"][j][0] != null && tasks["coordinates"][j][1] != null ){
      showPlaceholder(j, tasks["coordinates"][j][0], tasks["coordinates"][j][1]);
    }
  }
} else {
  i = 0;
  tasks = {
    "coordinates": [],
    "text": [],
    "time": [],
    "long": [],
    "ready": []
  };
}

window.onresize = function () {
  resizeMap();
}
window.addEventListener('load', function() {
  resizeMap();
  $(".add-button").prop("disabled", false);
});

var dialogMap = document.querySelector('.add-task');
var showModalButtonMap = document.querySelector('.show-modal');
if (!dialogMap.showModal) {
  dialogPolyfill.registerDialog(dialogMap);
}
showModalButtonMap.addEventListener('click', function() {
  dialogMap.showModal();
  saveAction = 'create';
  resizeMap();
  $("#task").val("");
  $("#taskDiv").removeClass("is-dirty");
  $("#time").val("12:00");
  $("#long").val("15");
  $(".add-task--done").prop("disabled", false);
  myMap.setCenter(userCoordinates);
});
dialogMap.querySelector('.add-task--close').addEventListener('click', function() {
  dialogMap.close();
  myCollection.removeAll();
  delete myPlacemark;
  coords = false;
  focusOnInput('blur');
  fullScreenButton.deselect();
});

tasks["coordinates"].forEach(function(item) {
  if( item[0] !=null && item[1] !=null ){
    coordsExist = true;
  }
});
if( coordsExist ){
  $(".build-route").css("display", "block");
}


var dialogReg = document.querySelector('.register-dialog');
var showDialogButtonReg = document.querySelector('.show-register-dialog');

if (! dialogReg.showModal) {
  dialogPolyfill.registerDialog(dialogReg);
}
showDialogButtonReg.addEventListener('click', function() {
  dialogReg.showModal();
});

dialogReg.querySelector('.register-dialog--close').addEventListener('click', function() {
  dialogReg.close();
  localStorage['code'] = '';

  $(".mdl-spinner").css("display", "none");
  $("#send-code").text("Зарегестрироваться");
  $("#send-code").prop("disabled", true);
  $("#send-code").attr("onclick", "sendCode();");
  if( params['darkTheme'] ){ $("#send-code").css("color", "#2C2F35"); }     else { $("#send-code").css("color", "#BDBDBD"); }

  $("#register-form").css("display", "block");
  $(".code-field").css("display", "none");

  $("#mail-field").val("");
  $("#password-field").val("");
  $("#pass-field").val("");
  $("#mail-field-div").removeClass("is-dirty").removeClass("is-invalid");
  $("#password-field-div").removeClass("is-dirty");
  $("#pass-field-div").removeClass("is-dirty");

  if( counter % 2 ){
    showPassword();
  }
});


var dialogLog = document.querySelector('.login-dialog');
var showDialogButtonLog = document.querySelector('.show-login-dialog');

if (! dialogLog.showModal) {
  dialogPolyfill.registerDialog(dialogLog);
}
showDialogButtonLog.addEventListener('click', function() {
  dialogLog.showModal();
});

dialogLog.querySelector('.login-dialog--close').addEventListener('click', function() {
  dialogLog.close();

  $("#login-field").val("");
  $("#parole-field").val("");
  $("#login-field-div").removeClass("is-invalid").removeClass("is-dirty");
  $("#parole-field-div").removeClass("is-invalid").removeClass("is-dirty");

});
