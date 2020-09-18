<?php 
    require_once("../helper/database.php"); 



    $sql = 
    "
         
            INSERT INTO `invoice`(`name`, `leaseagrm_id`) VALUES ('TEST 22', '1'); 
            INSERT INTO `invoice`(`name`, `leaseagrm_id`) VALUES ('TEST 32', '1'); 
            INSERT INTO `invoice`(`name`, `leaseagrm_id`) VALUES ('TEST 42', '1'); 
         
    "; 


    $sql = 
    "
        INSERT INTO `invoice`(`name`, `leaseagrm_id`) VALUES ('TEST 1', '1'); 
        SET @invoice_id=LAST_INSERT_ID(); 
    
        INSERT INTO `invoice`(`name`, `leaseagrm_id`) VALUES1 (CONCAT(CAST(@invoice_id AS CHAR),' TESTING FOR THE NEW INSERT ID BASY '), '1'); 
    "; 

    $queries = explode(";",trim($sql)); 

    $result = Connect::ExecTransaction(array_filter($queries)); 

    echo "<pre>"; 
    print_r($result); 
    echo "</pre>"; 


?>