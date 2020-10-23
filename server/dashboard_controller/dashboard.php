<?php 
    require_once("../helper/overview_queries.php"); 
    require_once("../helper/database.php"); 
    $sql = OverviewQueries\LeaseAgrm::OverviewDashboard() . Query::GeneralData("revenue_type") . "\n" . Query::GeneralData("expense_type"); 
    $data = Connect::MultiQuery($sql, true); 
    $result = 
    [
        "leaseagrm"=>$data[0], 
        "revenue_expense"=>
        [
            "revenue"=> $data[1], 
            "expense"=> $data[2]
        ]
    ]; 

    echo json_encode($result); 
?>