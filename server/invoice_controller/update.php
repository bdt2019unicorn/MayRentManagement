<?php 
    require_once("../helper/database.php"); 

    $invoices = json_decode($_POST["invoices"], true); 

    $queries = 
    [
        "insert"=>[], 
        "update"=>[], 
        "delete"=>[]
    ]; 

    if($invoices["new_data"]["invoice"]!=$invoices["edit_data"]["invoice"])
    {
        $conditions = ["id"=>$invoices["edit_data"]["invoice"]["id"]]; 
        $data = []; 
        $columns = array_keys($invoices["new_data"]["invoice"]); 
        foreach ($columns as $column) 
        {
            if($invoices["new_data"]["invoice"][$column]!=$invoices["edit_data"]["invoice"][$column])
            {
                $data[$column] = $invoices["new_data"]["invoice"][$column]; 
            }
        }
        $sql = Query::Update("invoices", $data, $conditions); 
        array_push($queries["update"], $sql); 
    }

    $invoice_id = $invoices["new_data"]["invoice"]["id"]; 

    $edit_data_details = ["leaseagrm"=>[], "utilities"=>[]]; 

    foreach ($edit_data_details as $table => $rows) 
    {
        foreach ($invoices["edit_data"]["details"][$table] as $index => $value) 
        {
            $edit_data_details[$table][$value["edit_id"]] = $index; 
        }
    }

    $table_columns = 
    [
        "leaseagrm"=>["amount", "name", "revenue_type_id", "start_date", "end_date", "price", "quantity"], 
        "utilities"=>["utility_reading_id", "name", "price", "quantity", "amount", "revenue_type_id"]
    ]; 

    foreach ($invoices["new_data"]["details"] as $table => $rows) 
    {
        foreach ($rows as $row) 
        {
            if(isset($row["edit_id"]))
            {
                // update 
                $edit_id = $row["edit_id"]; 
                $index = $edit_data_details[$table][$edit_id]; 
                $old_row = $invoices["edit_data"]["details"][$table][$index]; 
                echo '<pre>'; 
                print_r($old_row); 
                echo '<b>*****************</b>'; 
                print_r($row); 
                echo '<b>-----------------</b>'; 
                echo '</pre>'; 
                $data = []; 
                foreach ($table_columns[$table] as $column) 
                {
                    if($row[$column]!=$old_row[$column])
                    {
                        $data[$column] = $row[$column]; 
                    }
                }
                echo '<h3>Final data </h3>'; 
                echo '<pre>'; 
                print_r($data); 
                echo '</pre>'; 
                echo '<h3>////////////</h3>'; 
            }
            else 
            {
                // insert 
            }
        }
    }


    echo '<pre>'; 
    print_r($invoices); 

    print_r($edit_data_details); 

    print_r($queries); 
    echo '</pre>'; 


?>