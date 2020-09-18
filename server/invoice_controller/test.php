<?php 
    require_once("../helper/database.php"); 



    $sql = 
    "
         
            INSERT INTO `invoice`(`name`, `leaseagrm_id`) VALUES ('TEST 22', '1'); 
            INSERT INTO `invoice`(`name`, `leaseagrm_id`) VALUES ('TEST 32', '1'); 
            INSERT INTO `invoice`(`name`, `leaseagrm_id`) VALUES ('TEST 42', '1'); 
         
    "; 

    $result = Connect::TestMultiQuery($sql); 


    print_r($result); 


?>