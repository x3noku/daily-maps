var dialogTemp = document.querySelector('.template-dialog');
var showDialogButtonTemp = document.querySelector('.show-template-dialog');

if (! dialogTemp.showModal) {
  dialogPolyfill.registerDialog(dialogTemp);
}
showDialogButtonTemp.addEventListener('click', function() {
  dialogTemp.showModal();
});

dialogTemp.querySelector('.template-dialog--close').addEventListener('click', function() {
  dialogTemp.close();
});
