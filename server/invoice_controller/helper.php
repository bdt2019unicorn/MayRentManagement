<?php 
    require_once("../helper/database.php"); 

    function InvoiceInformationSql($invoice_id)
    {
        $tables = ["leaseagrm", "utilities"]; 
        $conditions = ["invoice_id"=>$invoice_id]; 
        function SelectUtilities()
        {
            $selects = ["`id` AS `edit_id`","`name`", "`invoice_id`", "`price`", "`quantity`", "`amount`", "`utility_reading_id` AS `id`", "`utility_reading_id`", "(SELECT `name` FROM `revenue_type` WHERE `id` = `invoice_utilities`.`revenue_type_id`) AS `revenue_type`"]; 

            $utility_reading_select = ["apartment_id", "date", "number", "revenue_type_id"]; 

            $utility_reading = []; 
            foreach ($utility_reading_select as $column) 
            {
                $utility_reading[$column] = "(SELECT `{$column}` FROM `utility_reading` WHERE `id`= `utility_reading_id`)"; 
                $select = "{$utility_reading[$column]} AS `{$column}`"; 
                array_push($selects, $select); 
            }

            $previous = ["number", "date"]; 
            foreach ($previous as $column) 
            {
                $select = 
                "
                    (
                        SELECT `{$column}` FROM `utility_reading`
                        WHERE 
                            `revenue_type_id` = {$utility_reading['revenue_type_id']} AND 
                            `apartment_id` = {$utility_reading['apartment_id']} AND 
                            `date` < {$utility_reading['date']} 
                        ORDER BY `date` DESC LIMIT 1 
                    ) AS `previous_{$column}`
                "; 
                array_push($selects, $select); 
            }
            return $selects; 
        }
        $selects = 
        [
            "leaseagrm" => ["*", "`id` AS `edit_id`", "(SELECT `name` FROM `revenue_type` WHERE `revenue_type`.`id` = `revenue_type_id`) AS `title`"], 
            "utilities"=>SelectUtilities()
        ]; 
        $sql = ""; 
        foreach ($tables as $table) 
        {
            $sql.= Query::SelectData("invoice_$table", $selects[$table], $conditions) ."\n"; 
        }
        return $sql; 
    }
?>