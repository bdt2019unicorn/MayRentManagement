<?php 
    require_once("helper.php"); 
    $actions = array 
    (
        "AddPeriodicInvoices" => function()
        {
            $periodic_invoices = json_decode($_POST["periodic_invoices"], true); 
            $test_mode = CurrentEnvironment::TestMode(); 
            $sql = array_map(function($invoices) use ($test_mode) {return ImportInvoice($invoices, $test_mode);}, $periodic_invoices); 

            if($test_mode)
            {
                $result = ConnectSqlite::InsertWithDetailsGroup($sql); 
            }
            else 
            {
                $sql = array_reduce($sql, function($current, $queries){return array_merge($current, $queries); }, []); 
                $result = Connect::ExecTransaction($sql); 
            }
            echo $result; 
            Database::LogUserAction($result, "Add Periodic Invoices", "invoices, invoice_leaseagrm, invoice_utilities", $_POST["periodic_invoices"], json_encode($sql)); 
        }, 
        "Import" => function()
        {
            $invoices = json_decode($_POST["invoices"], true); 
            $test_mode = CurrentEnvironment::TestMode(); 
            $data = ImportInvoice($invoices, $test_mode); 
            $result = $test_mode? ConnectSqlite::InsertWithDetails($data): Connect::ExecTransaction($data); 
            echo $result; 
            Database::LogUserAction($result, "Import Invoice", "invoices, invoice_leaseagrm, invoice_utilities", $_POST["invoices"], json_encode($data)); 
        }, 
        "Update" => function()
        {
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
            
            $result = Database::ExecTransaction($queries); 
            if($result)
            {
                Database::LogUserAction($result, "Edit Invoice", "invoices, invoice_leaseagrm, invoice_utilities", $_POST["invoices"], implode("\n", $queries)); 
                $invoice_information = Query::GeneralData("invoices", $invoice_id); 
                $invoice_details = InvoiceDetails($invoice_id); 

                if(CurrentEnvironment::TestMode())
                {
                    $sql = explode(";", $invoice_details); 
                    $result = 
                    [
                        "invoice" => ConnectSqlite::Query($invoice_information)[0], 
                        "details" => 
                        [
                            "leaseagrm"=>ConnectSqlite::Query($sql[0]), 
                            "utilities"=>ConnectSqlite::Query($sql[1])
                        ]
                    ]; 
                }
                else 
                {
                    $sql = implode("\n", [$invoice_information, $invoice_details]); 
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
                }

                echo json_encode($result); 
            }
            else 
            {
                echo $result; 
            }
        }
    ); 
    
    try 
    {
        $actions[$_GET["command"]](); 
    }
    catch (\Throwable $throwable)
    {
        echo false; 
    }

?>