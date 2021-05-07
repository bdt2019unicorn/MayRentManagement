<?php 
    require_once("../../helper/database.php"); 
    require_once("../../helper/overview_queries.php"); 

    function ImportInvoice($invoices, $test_mode = false)
    {
        if($test_mode)
        {
            return 
            [
                "table" => "invoices", 
                "main" => $invoices["invoice"], 
                "details"=>
                [
                    "invoice_leaseagrm" => 
                    [
                        "reference_key"=> "invoice_id", 
                        "data" => $invoices["details"]["leaseagrm"]??null 
                    ], 
                    "invoice_utilities" => 
                    [
                        "reference_key"=> "invoice_id", 
                        "data" => $invoices["details"]["utilities"]??null 
                    ]
                ] 
            ]; 
        }
        else 
        {
            $queries = []; 
            array_push($queries, Query::Insert("invoices", $invoices["invoice"]), "SET @invoice_id=LAST_INSERT_ID();"); 
        
            foreach ($invoices["details"] as $table => $values) 
            {
                foreach ($values as $data) 
                {
                    array_push($queries, Query::Insert("invoice_{$table}", $data, ["invoice_id"=>"@invoice_id"])); 
                }
            }
            return $queries; 
        }
    }
    
    function InvoiceDetails($invoice_id)
    {
        $tables = ["leaseagrm", "utilities"]; 
        $conditions = ["invoice_id"=>$invoice_id]; 
        $SelectUtilities = function()
        {
            $selects = ["`id` AS `edit_id`","`name`", "`invoice_id`", "`price`", "`quantity`", "`amount`", "`utility_reading_id` AS `id`", "`utility_reading_id`", "(SELECT `revenue_type`.`name` FROM `revenue_type` WHERE `revenue_type`.`id` = `invoice_utilities`.`revenue_type_id`) AS `revenue_type`"]; 

            $utility_reading_select = ["unit_id", "date", "number", "revenue_type_id"]; 

            $utility_reading = []; 
            foreach ($utility_reading_select as $column) 
            {
                $utility_reading[$column] = "(SELECT `{$column}` FROM `utility_reading` WHERE `id`= `utility_reading_id`)"; 
                $select = "{$utility_reading[$column]} AS `{$column}`"; 
                array_push($selects, $select); 
            }

            $previous = ["number", "date"]; 
            $previous = array_map
            (
                function($column) use ($utility_reading)
                {
                    return 
                    "
                        (
                            SELECT `{$column}` FROM `utility_reading`
                            WHERE 
                                `revenue_type_id` = {$utility_reading['revenue_type_id']} AND 
                                `unit_id` = {$utility_reading['unit_id']} AND 
                                `date` < {$utility_reading['date']} 
                            ORDER BY `date` DESC LIMIT 1 
                        ) AS `previous_{$column}`
                    "; 
                }, $previous
            ); 
            return array_merge($selects, $previous); 
        }; 
        $selects = 
        [
            "leaseagrm" => ["*", "`id` AS `edit_id`", "(SELECT `revenue_type`.`name` FROM `revenue_type` WHERE `revenue_type`.`id` = `revenue_type_id`) AS `title`"], 
            "utilities"=>$SelectUtilities()
        ]; 
        return array_reduce($tables, function($current, $table) use ($selects, $conditions){return $current. Query::SelectData("invoice_$table", $selects[$table], $conditions) . "\n";}, ""); 
    }

    function InvoiceInformation($leaseagrm_id)
    {
        require_once("helper/InvoiceInformation.php"); 
        $invoice_information = new InvoiceInformation($leaseagrm_id); 
        return $invoice_information->GetInformation(); 
    }
?>