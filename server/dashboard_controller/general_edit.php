<?php 
    require_once("../helper/database.php"); 
    require_once("../helper/overview_queries.php"); 
    $controller = $_GET["controller"]; 

    $user_input = OverviewQueries\GeneralOverview::UserInput($controller, $_GET["lang"]??"en"); 

    $form = $user_input["form"]; 

    $select_data_building_separate = []; 

    foreach ($form as $row_number => $row_group) 
    {
        foreach ($row_group as $component_number => $component) 
        {
            if($overview_controller = ($component["overview_controller"]??null))
            {
                if(isset($select_data_building_separate[$overview_controller]))
                {
                    $user_input["form"][$row_number][$component_number]["select_data"] = $select_data_building_separate[$overview_controller]; 
                }
                else 
                {
                    $general_overview = new OverviewQueries\GeneralOverview(1, null, null, $overview_controller); 
                    $select_data = Database::SelectData($overview_controller, $general_overview->GetArray("Selects"), null); 

                    $user_input["form"][$row_number][$component_number]["select_data"] = $select_data; 
                    $select_data_building_separate[$overview_controller] = $select_data; 
                }
            }
        }
    }
    echo json_encode($user_input); 
?>