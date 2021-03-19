<?php 
    require_once(realpath(__DIR__."/../vendor/autoload.php")); 
    $email = new \SendGrid\Mail\Mail(); 
    $email->setFrom("test@example.com", "Example User");
    $email->setSubject("Sending with SendGrid is Fun");
    $email->addTo("blastor5555@yopmail.com", "Example User");
    $email->addContent("text/plain", "and easy to do anywhere, even with PHP");
    $email->addContent(
        "text/html", "<strong>and easy to do anywhere, even with PHP</strong>"
    );
    $sendgrid = new \SendGrid("Send Email");
    try {
        $response = $sendgrid->send($email);
        print $response->statusCode() . "\n";
        print_r($response->headers());
        print $response->body() . "\n";
    } catch (Exception $e) {
        echo 'Caught exception: '. $e->getMessage() ."\n";
    }

?>