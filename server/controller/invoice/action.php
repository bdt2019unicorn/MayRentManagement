<?php
    require_once("helper.php"); 

    $actions = array 
    (
        "AddMonthlyInvoices"=>function()
        {
            $date_format = "Y-m-d"; 
            $last_date_of_month = (new DateTime())->modify("last day of"); 

            $leaseagrms = 
            "
                SELECT * FROM `leaseagrm` 
                WHERE 
                    `unit_id` IN (SELECT `id` FROM `unit` WHERE `building_id` = '{$_GET['building_id']}') AND 
                    CURRENT_DATE BETWEEN `Start_date` AND `Finish`
            "; 

            function RevenueTypes()
            {
                $data = Database::SelectData("revenue_type", ["*"]); 
                $revenue_types = []; 
                foreach ($data as $utility) 
                {
                    $revenue_types[$utility["id"]] = $utility["name"]; 
                }
                return $revenue_types; 
            }

            function CompareDate($start_date, $end_date)
            {
                $date_format = "Y-m-d"; 
                $start_date = new DateTime($start_date->format($date_format)); 
                $end_date = new DateTime($end_date->format($date_format)); 
                return $start_date<$end_date; 
            }

            $revenue_types = RevenueTypes(); 

            $leaseagrms = Database::GetData($leaseagrms); 
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
                            if(CompareDate($start_date, $end_date))
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
                        "leaseagrm_period"=> $invoice_information["leaseagrm"]['leaseagrm_period'], 
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
            $leaseagrm_select_data = Query::SelectData("leaseagrm", ["*"]);
            
            if($building_id)
            {
                $leaseagrm_select_data = str_replace(";", "", $leaseagrm_select_data); 
                $unit_conditions = Query::SelectData("unit", ["id"], ["building_id"=>$building_id]); 
                $unit_conditions = str_replace(";", "", $unit_conditions); 
                $leaseagrm_select_data.= "WHERE `unit_id` IN ({$unit_conditions});"; 
            } 
            $leaseagrm_revenue_type = Query::SelectData("revenue_type", ["*"], ["is_utility"=>"0"]); 
            $utility_revenue_type = Query::SelectData("revenue_type", ["*"], ["is_utility"=>"1"]);

            if(CurrentEnvironment::TestMode())
            {
                $extra_information = 
                [
                    "leaseagrm_select_data" => ConnectSqlite::Query($leaseagrm_select_data), 
                    "revenue_type" => 
                    [
                        "leaseagrm" => ConnectSqlite::Query($leaseagrm_revenue_type), 
                        "utilities" => ConnectSqlite::Query($utility_revenue_type)
                    ]                     
                ]; 
            }
            else 
            {
                $sql = implode("\n", [$leaseagrm_select_data, $leaseagrm_revenue_type, $utility_revenue_type]); 
                $data = Connect::MultiQuery($sql, true); 
                $extra_information = 
                [
                    "leaseagrm_select_data" => $data[0], 
                    "revenue_type" => 
                    [
                        "leaseagrm" => $data[1], 
                        "utilities" => $data[2]
                    ] 
                ]; 
            }

            $configs = array_merge($extra_information, ["user_input" => OverviewQueries\GeneralOverview::UserInput("invoice", $_GET["lang"]??"en")]); 
            echo json_encode($configs); 
        }, 
        "InvoiceDetails"=>function()
        {
            $sql = InvoiceDetails($_GET["invoice_id"]); 
            $tables = ["leaseagrm", "utilities"]; 
            $result = []; 
            if(CurrentEnvironment::TestMode())
            {
                $queries = explode(";", $sql); 
                foreach ($tables as $key => $table) 
                {
                    $result[$table] = ConnectSqlite::Query($queries[$key]); 
                }
            }
            else 
            {
                $data = Connect::MultiQuery($sql, true); 
                foreach ($tables as $key => $table) 
                {
                    $result[$table] = $data[$key]; 
                }
            }

            echo json_encode($result); 
        }, 
        "InvoiceInformation"=>function()
        {
            $invoice_information = InvoiceInformation($_GET['leaseagrm_id']); 
            echo(json_encode($invoice_information)); 
        }, 
        "LeasearmPeriodsSepcial"=>function()
        {
            $data = Database::SelectData("leaseagrm_period", ["*"], ["is_basic"=>0]); 
            $special_periods = []; 
            foreach ($data as $leaseagrm_period) 
            {
                $name = $leaseagrm_period["name"]; 
                $special_periods[$name] = $leaseagrm_period["calculation_method"]; 
            }
            echo json_encode($special_periods); 
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