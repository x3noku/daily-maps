window.addEventListener('load', function() {
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
});
