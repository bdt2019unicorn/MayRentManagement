<?php 
    require_once("./helper.php"); 

    $invoices = json_decode($_POST["invoices"], true); 

    $queries = []; 

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
        array_push($queries, $sql); 
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
                $edit_id = $row["edit_id"]; 
                $index = $edit_data_details[$table][$edit_id]; 
                $old_row = $invoices["edit_data"]["details"][$table][$index]; 
                $data = []; 
                foreach ($table_columns[$table] as $column) 
                {
                    if($row[$column]!=$old_row[$column])
                    {
                        $data[$column] = $row[$column]; 
                    }
                }

                if(count($data)>0)
                {
                    $conditions = ["id"=>$edit_id]; 
                    $sql = Query::Update("invoice_{$table}", $data, $conditions); 
                    array_push($queries, $sql); 
                }
                unset($edit_data_details[$table][$edit_id]); 
            }
            else 
            {
                $data = $row; 
                $data["invoice_id"] = $invoice_id; 
                $sql = Query::Insert("invoice_{$table}", $data); 
                array_push($queries, $sql); 
            }
        }
    }

    foreach ($edit_data_details as $table => $rows) 
    {
        if(count($rows)>0)
        {
            $delete_ids = array_keys($rows); 
            $sql = "DELETE FROM `invoice_{$table}` WHERE `id` IN ('" . implode("', '", $delete_ids) ."');"; 
            array_push($queries, $sql);  
        }
    }


    $result = Connect::ExecTransaction($queries); 
    if($result)
    {
        $sql = Query::GeneralData("invoices", $invoice_id); 
        $sql.="\n" . InvoiceDetails($invoice_id); 

        $edit_data = Connect::MultiQuery($sql, true); 

        $result = 
        [
            "invoice"=>$edit_data[0][0], 
            "details"=>
            [
                "leaseagrm"=>$edit_data[1], 
                "utilities"=>$edit_data[2]
            ]
        ]; 
        echo json_encode($result); 
    }
    else 
    {
        echo $result; 
    }
?>