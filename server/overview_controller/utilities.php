<?php 
    require_once("../helper/connect.php"); 
    require_once("../helper/query.php"); 
    
    $conditions_sql = 
    "
        FROM 
            `apartment` LEFT JOIN `utility_reading` ON `apartment`.`id` = `utility_reading`.`apartment_id`,
            `buildings`
        WHERE 
            `apartment`.`building_id` = `buildings`.`id` 
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
            $conditions_sql.="AND `apartment`.`id`='{$_POST['apartment_id']}'"; 
            $apartments = Connect::GetDataWithId($_POST["apartment_id"], "apartment"); 
        }
    }
    $conditions_sql.="\nORDER BY `apartment`.`id`, `utility_reading`.`date`\n"; 
	$full_data_sql = 
	"
        SELECT DISTINCT 
            `apartment`.`id` AS `apartment_id`, 
            `apartment`.`name` AS `Apartment Name`, 
            `utility_reading`.`revenue_type_id`, 
            `utility_reading`.`date`, 
            `utility_reading`.`number`, 
            (
                SELECT MAX(`ur`.`number`)
                FROM `utility_reading` ur
                WHERE 
                    `ur`.`date` = 
                    (
                        SELECT MAX(`u_r`.`date`)
                        FROM `utility_reading` u_r 
                        WHERE 
                            `utility_reading`.`date`>`u_r`.`date`
                            AND `u_r`.`apartment_id` = `utility_reading`.`apartment_id`
                            AND `u_r`.`revenue_type_id` = `utility_reading`.`revenue_type_id`
                    )
                    AND `ur`.`apartment_id` = `utility_reading`.`apartment_id`
                    AND `ur`.`revenue_type_id` = `utility_reading`.`revenue_type_id`
            ) AS 'smaller_number', 
            (
                SELECT MAX(`up`.`value`)
                FROM `utility_price` up
                WHERE 
                    `up`.`date_valid` = 
                    (
                        SELECT MAX(`utility_price`.`date_valid`)
                        FROM `utility_price`
                        WHERE `utility_price`.`date_valid`<=`utility_reading`.`date`
                        AND `utility_price`.`revenue_type_id` = `utility_reading`.`revenue_type_id`
                    )
                    AND `up`.`revenue_type_id` = `utility_reading`.`revenue_type_id`
            ) AS 'unit_price'
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
            "revenue_type_id" => $_POST["revenue_type_id"], 
            "apartment_table"=>array()
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
            $date = date_format(date_create($values["date"]), "d M Y"); 
            $data[$values["apartment_id"]][$date] = $values["number"]; 
            
            $consumption = doubleval($values["number"]) - doubleval($values["smaller_number"]); 
            $data[$values["apartment_id"]]["apartment_table"][$values["date"]] =
            array
            (
                "Date"=> $date,
                "Time"=>date_format(date_create($values["date"]), "G:i:s"), 
                "Reading"=>$values["number"], 
                "Consumption"=> $consumption, 
                "Unit price (VND/kWh)"=> $values["unit_price"],
                "Bill"=>$consumption*doubleval($values["unit_price"])
            );  

        }
    }

    $utilities_overview = []; 

    foreach ($data as $apartment_values) 
    {
        array_push($utilities_overview, $apartment_values); 
    }

    echo json_encode($utilities_overview); 
?>