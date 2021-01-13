<?php 
    require_once("../helper/database.php"); 
    require_once("../helper/overview_queries.php"); 
    $id = 12; 

    $document = new OverviewQueries\Documents(1, null, $id); 
    $data = Database::GetData($document->Documents(CurrentEnvironment::TestMode())); 
    echo '<pre>'; print_r($data); echo '</pre>'; 

?>