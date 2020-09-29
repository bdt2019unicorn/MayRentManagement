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




    echo '<pre>'; 
    print_r($invoices); 

    print_r($queries); 
    echo '</pre>'; 


?>