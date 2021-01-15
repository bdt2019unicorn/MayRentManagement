<?php 
    require_once("test-support.php"); 
    // echo $sql; 
    $data = Connect::MultiQuery($sql, true); 
    echo "<pre>"; print_r($data); echo "</pre>"; 


    // $sql = 

    


    /*


    Need to look 

    rent_amount 
    paid_amount 
    total_amount 
    // different = paid - total_amount 
    leaseagrm_period 





    */
?>