<?php
    require_once("./helper.php"); 

    $actions = array 
    (
        "AddMonthlyInvoices"=>function()
        {
            $date_format = "Y-m-d"; 
            $last_date_of_month = (new DateTime())->modify("last day of"); 
            $last_date_of_month = new DateTime($last_date_of_month->format($date_format)); 

            $leaseagrms = 
            "
                SELECT * FROM `leaseagrm` 
                WHERE 
                    `unit_id` IN (SELECT `id` FROM `unit` WHERE `building_id` = '{$_GET['building_id']}') AND 
                    CURRENT_DATE BETWEEN `Start_date` AND `Finish`
            "; 

            function RevenueTypes()
            {
                $data = Connect::SelectData("revenue_type", ["*"]); 
                $revenue_types = []; 
                foreach ($data as $utility) 
                {
                    $revenue_types[$utility["id"]] = $utility["name"]; 
                }
                return $revenue_types; 
            }

            $revenue_types = RevenueTypes(); 

            $leaseagrms = Connect::GetData($leaseagrms); 
            $monthly_invoices = []; 
            foreach ($leaseagrms as $leaseagrm) 
            {
                $invoice_information = InvoiceInformation($leaseagrm["id"]); 
                $lease_end = new DateTime($leaseagrm["Finish"]); 
                $invoice_leaseagrm = []; 
                foreach ($invoice_information["leaseagrm"]["rent_information"] as $rent_information) 
                {
                    if(trim($rent_information["end_date"]))
                    {
                        array_push($invoice_leaseagrm, $rent_information); 
                    }
                    else
                    {
                        $start_date = new DateTime($rent_information["start_date"]); 
                        if($start_date<$lease_end)
                        {
                            $end_date = min($last_date_of_month, $lease_end); 
                            if($start_date<$end_date)
                            {
                                $new_information = 
                                [
                                    "start_date"=> $rent_information["start_date"], 
                                    "end_date"=>$end_date->format($date_format)
                                ]; 
                                array_push($invoice_leaseagrm, $new_information); 
                            }
                        }
                    }
                } 

                if(count($invoice_leaseagrm)+count($invoice_information["utilities"]))
                {
                    $monthly_invoices[$leaseagrm["id"]] = 
                    [
                        "name"=>"{$leaseagrm['id']} ({$leaseagrm['name']}) - {$invoice_information['unit_name']} - Month end {$last_date_of_month->format('d M Y')}", 
                        "leaseagrm_name"=> $leaseagrm['name'], 
                        "rent_amount"=>$leaseagrm["Rent_amount"], 
                        "leaseagrm"=>$invoice_leaseagrm, 
                        "unit_name"=>$invoice_information['unit_name'], 
                        "utilities"=> $invoice_information["utilities"], 
                        "revenue_types"=>$revenue_types
                    ];    
                }

            }
            echo json_encode($monthly_invoices); 
        }, 
        "InvoiceConfigs"=> function()
        {
            $building_id = $_GET['building_id']?? null; 
            $sql = Query::SelectData("leaseagrm", ["*"]);
            if($building_id)
            {
                $sql = str_replace(";", "", $sql); 
                $unit_conditions = Query::SelectData("unit", ["id"], ["building_id"=>$building_id]); 
                $unit_conditions = str_replace(";", "", $unit_conditions); 
                $sql.= "WHERE `unit_id` IN ({$unit_conditions});"; 
            } 
            $sql.= "\n" . Query::SelectData("revenue_type", ["*"], ["is_utility"=>"0"]) . "\n" . Query::SelectData("revenue_type", ["*"], ["is_utility"=>"1"]); 
            $user_input = OverviewQueries\GeneralOverview::UserInput("invoice"); 

            $data = Connect::MultiQuery($sql, true); 
            $configs = 
            [
                "leaseagrm_select_data" => $data[0], 
                "revenue_type" => 
                [
                    "leaseagrm" => $data[1], 
                    "utilities" => $data[2]
                ], 
                "user_input" => $user_input
            ]; 

            echo json_encode($configs); 
        }, 
        "InvoiceDetails"=>function()
        {
            $tables = ["leaseagrm", "utilities"]; 
            $sql = InvoiceDetails($_GET["invoice_id"]); 
            $data = Connect::MultiQuery($sql, true); 

            $result = []; 
            foreach ($tables as $key => $table) 
            {
                $result[$table] = $data[$key]; 
            }
            echo json_encode($result); 
        }, 
        "InvoiceInformation"=>function()
        {
            $invoice_information = InvoiceInformation($_GET['leaseagrm_id']); 
            echo(json_encode($invoice_information)); 
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