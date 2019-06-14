<?php
$data = $_POST;
$email = $data['email'];
$code = $data['code'];

$subject = '[daily.Maps] Подтверждение почтового адреса.';
$message = '
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>Подтверждение почтового адреса.</title>
</head>
<body>
  <p><span style="font-size: 10pt;"><img src="https://dailymaps.h1n.ru/img/icon/icon-long.png" alt="Логотип daily.Maps" width="276" height="69" /></span></p>
  <hr />
  <p><span style="font-size: 10pt;">Регистрация почти закончена!</span></p>
  <p><span style="font-size: 10pt;">Чтобы завершить регистрацию введите этот код:</span></p>
  <p style="padding: 12px; border-left: 6px solid #eee; font-style: italic;">
    <span style="font-size: 12pt;">
      <strong>
        '. $code .'
      </strong>
    </span>
  </p>
  <p><span style="font-size: 10pt;">&nbsp;</span></p>
  <hr />
  <p><span style="font-size: 10pt;">С уважением, daily.Maps</span></p>
</body>
</html>
';
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= "Content-type: text/html; charset=utf-8 \r\n";
$headers .= 'From: no-reply@dailymaps.h1n.ru' . "\r\n";

mail( $email, $subject, $message, $headers );

?>

<!--



-->
