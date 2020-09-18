<?php 

    $invoices = json_decode($_POST["invoices"]); 


    echo"<pre>"; 
    print_r($_POST); 
    print_r($invoices); 
    echo "</pre>"; 

    // INSERT INTO `invoice`(`name`, `leaseagrm_id`) VALUES ('TEST 1', '1'); 
    // SET @invoice_id=LAST_INSERT_ID(); 
    
    // INSERT INTO `invoice`(`name`, `leaseagrm_id`) VALUES (CONCAT(CAST(@invoice_id AS CHAR),' TESTING FOR THE NEW INSERT ID BASY '), '1'); 

    //     SET @invoice_id=LAST_INSERT_ID(); 
    
    // INSERT INTO `invoice`(`name`, `leaseagrm_id`) VALUES (CONCAT(CAST(@invoice_id AS CHAR),' TESTING FOR THE NEW INSERT ID BASY '), '1'); 


?>