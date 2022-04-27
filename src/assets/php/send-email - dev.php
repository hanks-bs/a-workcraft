<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './phpmailer/src/Exception.php';
require './phpmailer/src/PHPMailer.php';
require './phpmailer/src/SMTP.php';

//CONFIG
$smtpUsername = "contactform@hanks.usermd.net";
$smtpPassword = "P6D9QMFRq82pLEf";

$user_message = "Complete";

$emailTo = "contactform@hanks.usermd.net";
$emailToName = "Formularz kontaktowy";

$subject = "Formularz kontaktowy";
$fullname = $_POST["name"];
$message = $_POST["message"];
$phone = $_POST["phone"];
$email = $_POST["email"];

$maxFileSize = 5242880; // 5 mb
$expensions= array("jpeg","jpg","png","pdf");

if($_FILES) {
    if(count($_FILES) > 3) return print_r("Too many files");
    
}

for($i=0; $i< count($_FILES); $i++) {
    if($_FILES["$i"]["size"] > $maxFileSize) return print_r("File is too large");

    $file_size = $_FILES["$i"]['size'];
    $file_ext_tmp = explode('.',$_FILES["$i"]['name']);
    $file_ext=strtolower(end($file_ext_tmp));

    if(in_array($file_ext,$expensions)=== false){
       return print_r("Invalid file extension");
     }
    
}


$messageToSend = "<b>Imie i nazwisko:</b> $fullname <br>"
    ."<b>Email:</b> $email <br>"
    ."<b>Numer telefonu:</b> $phone <br>"
    ."<b>Wiadomość:</b> $message";

$emailFrom = 'contactform@hanks.usermd.net';
$emailFromName = $fullname;

$mail = new PHPMailer;
$mail->isSMTP();
$mail->SMTPDebug = 0; // 0 = off (for production use) - 1 = client messages - 2 = client and server messages
$mail->Host = "mail41.mydevil.net"; // use $mail->Host = gethostbyname('smtp.gmail.com');
$mail->Port = 587; // TLS only
$mail->SMTPSecure = 'tls'; // ssl is depracated
$mail->SMTPAuth = true;
$mail->Username = $smtpUsername;
$mail->Password = $smtpPassword;
$mail->CharSet = "UTF-8";
$mail->setFrom($emailFrom, $emailFromName);
$mail->addAddress($emailTo, $emailToName);
$mail->Subject = $subject;
$mail->msgHTML($messageToSend); //$mail->msgHTML(file_get_contents('contents.html'), __DIR__); //Read an HTML message body from an external file, convert referenced images to embedded,
$mail->AltBody = 'HTML messaging not supported';
for($i=0; $i< count($_FILES); $i++) {
    $mail->addAttachment($_FILES["$i"]['tmp_name'], $_FILES["$i"]['name']); 
    
}
if(!$mail->send() && $user_message=="Complete"){
    $user_message = "Error";
    echo "Mailer Error: " . $mail->ErrorInfo;
}else{
    $user_message = "Complete";
}



print_r($user_message);