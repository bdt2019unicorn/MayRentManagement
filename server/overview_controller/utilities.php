<?php 
    require_once("../helper/database.php"); 
    
    $conditions_sql = 
    "
        FROM 
            `unit` LEFT JOIN `utility_reading` ON `unit`.`id` = `utility_reading`.`unit_id`,
            `buildings`
        WHERE 
            `unit`.`building_id` = `buildings`.`id` 
            AND `buildings`.`id` = '{$_GET['building_id']}'
            AND `utility_reading`.`revenue_type_id` = '{$_POST['revenue_type_id']}' 
            AND (`utility_reading`.`date` BETWEEN '{$_POST['start_date']}' AND '{$_POST['end_date']}')
    "; 
    $units = null; 

    if(isset($_POST["unit_id"]))
    {
        if($_POST["unit_id"])
        {
            $conditions_sql.="AND `unit`.`id`='{$_POST['unit_id']}'"; 
            $units = Database::GeneralData("unit", $_POST["unit_id"]); 
        }
    }
    $conditions_sql.="\nORDER BY `utility_reading`.`date`, `unit`.`id`\n"; 
	$full_data_sql = 
	"
        SELECT DISTINCT 
            `unit`.`id` AS `unit_id`, 
            `unit`.`name` AS `Unit Name`, 
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
                            AND `u_r`.`unit_id` = `utility_reading`.`unit_id`
                            AND `u_r`.`revenue_type_id` = `utility_reading`.`revenue_type_id`
                    )
                    AND `ur`.`unit_id` = `utility_reading`.`unit_id`
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

    $full_data = Database::GetData($full_data_sql); 

    $dates = Database::GetData("SELECT DISTINCT `utility_reading`.`date` {$conditions_sql}"); 
    $units = ($units)?$units: Database::GetData("SELECT * FROM `unit` WHERE `unit`.`building_id` = '{$_GET['building_id']}'"); 
    $revenue_type_ids = Database::GetData("SELECT DISTINCT `utility_reading`.`revenue_type_id` {$conditions_sql}"); 

    for ($i=0; $i <count($dates) ; $i++) 
    { 
        if($dates[$i]["date"])
        {
            $dates[$i]["date"] = date_format(date_create($dates[$i]["date"]), "d M Y"); 
        }
    }
    
    $data = array(); 


    foreach ($units as $aparment) 
    {
        $data[$aparment["id"]] = array
        (
            "unit_id" => $aparment["id"], 
            "Unit Name" => $aparment["name"], 
            "revenue_type_id" => $_POST["revenue_type_id"], 
            "unit_table"=>array()
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
            $data[$values["unit_id"]][$date] = $values["number"]; 
            
            $consumption = doubleval($values["number"]) - doubleval($values["smaller_number"]); 
            $data[$values["unit_id"]]["unit_table"][$values["date"]] =
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
    foreach ($data as $unit_values) 
    {
        array_push($utilities_overview, $unit_values); 
    }
    echo json_encode($utilities_overview); 
?>