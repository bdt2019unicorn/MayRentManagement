<?php 
    require_once("../helper/connect.php"); 
    require_once("../helper/query.php"); 
    
    $where = 
    "
        WHERE `apartment`.`building_id` = `buildings`.`id` 
        AND `buildings`.`id` = '{$_GET['building_id']}'
        AND `utility_reading`.`revenue_type_id` = '{$_POST['revenue_type_id']}' 
        AND `utility_reading`.`date`>='{$_POST['start_date']}' 
        AND `utility_reading`.`date`<='{$_POST['end_date']}'
    "; 

    $apartments = null; 

    if(isset($_POST["apartment_id"]))
    {
        if($_POST["apartment_id"])
        {
            $where.="AND `apartment`.`id`={$_POST['apartment_id']}"; 
            $apartments = Connect::GetDataWithId($_POST["apartment_id"], "apartment"); 
        }
    }

    $conditions_sql = 
    "
        FROM `apartment` LEFT JOIN `utility_reading` ON `apartment`.`id` = `utility_reading`.`apartment_id`, `buildings`
        {$where}
    "; 
	$full_data_sql = 
	"
        SELECT DISTINCT `apartment`.`id` AS `apartment_id`, `apartment`.`name` AS `Apartment Name`, `utility_reading`.`revenue_type_id`, `utility_reading`.`date`, `utility_reading`.`number`
        {$conditions_sql}

    "; 

    $full_data = Connect::GetData($full_data_sql); 

    $dates = Connect::GetData("SELECT DISTINCT `utility_reading`.`date` {$conditions_sql}"); 
    $apartments = ($apartments)?$apartments: Connect::GetData("SELECT * FROM `apartment` WHERE `apartment`.`building_id` = '{$_GET['building_id']}'"); 
    $revenue_type_ids = Connect::GetData("SELECT DISTINCT `utility_reading`.`revenue_type_id` {$conditions_sql}"); 

    for ($i=0; $i <count($dates) ; $i++) 
    { 
        if($dates[$i]["date"])
        {
            $dates[$i]["date"] = date_format(date_create($dates[$i]["date"]), "d M Y"); 
        }
    }
    
    $data = array(); 


    foreach ($apartments as $aparment) 
    {
        $data[$aparment["id"]] = array
        (
            "apartment_id" => $aparment["id"], 
            "Apartment Name" => $aparment["name"], 
            "revenue_type_id" => $_POST["revenue_type_id"]
        ); 

        foreach ($dates as $date) 
        {
            if($date["date"])
            {
                $data[$aparment["id"]][$date["date"]] = ""; 
            }
        }
    }

    foreach ($full_data as $values) 
    {
        if($values["date"])
        {
            $data[$values["apartment_id"]][date_format(date_create($values["date"]), "d M Y")] = $values["number"]; 
        }
    }

    $utilities_overview = []; 

    foreach ($data as $apartment_values) 
    {
        array_push($utilities_overview, $apartment_values); 
    }

    echo json_encode($utilities_overview); 


?>