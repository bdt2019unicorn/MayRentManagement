<?php 
    require_once("../helper/overview_queries.php"); 
    require_once("../helper/database.php"); 

    $test_mode = CurrentEnvironment::TestMode(); 
    if($test_mode)
    {
        $result = 
        [
            "leaseagrm"=> ConnectSqlite::Query(OverviewQueries\LeaseAgrm::OverviewDashboard($test_mode)), 
            "revenue_expense"=>
            [
                "revenue"=> ConnectSqlite::Query(Query::GeneralData("revenue_type")), 
                "expense"=> ConnectSqlite::Query(Query::GeneralData("expense_type"))
            ]
        ]; 
    }
    else 
    {
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
    }
    


    echo json_encode($result); 
?>