<?php 
    require_once("current_environment.php"); 
    $current_environment = new CurrentEnvironment(); 

    $email = new \SendGrid\Mail\Mail(); 
    $email->setFrom($_ENV["NOTIFICATION_EMAIL"]);
    $email->setSubject($_POST["subject"]);
    $email->addTo($_POST["to"]);
    $email->addContent("text/html", $_POST["content"]);
    $sendgrid = new \SendGrid($_ENV["EMAIL_API"]);

    try 
    {
        $response = $sendgrid->send($email);
        print_r($response); 
    } 
    catch (Exception $e) 
    {
        echo 'Caught exception: '. $e->getMessage() ."\n";
    }
?>