<?php 
    require_once("../helper/database.php"); 
    require_once("../helper/overview_queries.php"); 
    $controller = $_GET["controller"]; 

    $user_input = OverviewQueries\GeneralUserInput::UserInput($controller); 

    $form = $user_input["form"]; 

    $select_data_building_separate = []; 

    foreach ($form as $row_group) 
    {
        foreach ($row_group as $component) 
        {
            if($overview_controller = ($component["overview_controller"]??null))
            {
                if(isset($select_data_building_separate[$overview_controller]))
                {
                    $component["select_data"] = $select_data_building_separate[$overview_controller]; 
                }
                else 
                {
                    // $select_data = Connect::SelectData()
                }
            }
        }
    }


?>