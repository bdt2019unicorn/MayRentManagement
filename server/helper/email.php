<?php 
    require_once("current_environment.php"); 
    $current_environment = new CurrentEnvironment(); 

    print_r($_POST); 
    
    $email = new \SendGrid\Mail\Mail(); 
    $email->setFrom($_ENV["NOTIFICATION_EMAIL"]);
    $email->setSubject($_POST["subject"]);
    $email->addTo($_POST["to"]);
    $email->addContent("text/html", $_POST["content"]);
    $sendgrid = new \SendGrid($_ENV["EMAIL_API"]);

    try 
    {
        $response = $sendgrid->send($email);
        echo true; 
    } 
    catch (Exception $e) 
    {
        echo 'Caught exception: '. $e->getMessage() ."\n";
    }







?>