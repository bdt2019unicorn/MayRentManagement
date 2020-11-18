<?php 
    require_once("../helper/database.php"); 
    require_once("../helper/overview_queries.php"); 
    $controller = $_GET["controller"]; 

    // $user_input = OverviewQueries\GeneralOverview::UserInput($controller); 

    // $form = $user_input["form"]; 

    // $select_data_building_separate = []; 

    // foreach ($form as $row_group) 
    // {
    //     foreach ($row_group as $component) 
    //     {
    //         if($overview_controller = ($component["overview_controller"]??null))
    //         {
    //             if(isset($select_data_building_separate[$overview_controller]))
    //             {
    //                 $component["select_data"] = $select_data_building_separate[$overview_controller]; 
    //             }
    //             else 
    //             {
    //                 // $select_data = Connect::SelectData()
    //             }
    //         }
    //     }
    // }


    $general_overview = new OverviewQueries\GeneralOverview(null, null, null, $controller); 

    $unit_selects = $general_overview->GetArray("Selects"); 
    $unit_conditions = $general_overview->GetArray("Conditions"); 

    echo '<pre>'; 
    print_r($unit_selects); 
    echo '</pre>'; 


    // $unit_test = new OverviewQueries\Unit(null, null, null); 

    // $selects = $unit_test->GetArray("Selects"); 

    // print_r($selects); 

?>