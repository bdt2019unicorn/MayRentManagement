<?php 
    require_once("./helper/database.php"); 

    $sql = 
    "
        SHOW CREATE TABLE buildings;
        SHOW CREATE TABLE document_type;
        SHOW CREATE TABLE documents;
        SHOW CREATE TABLE expense;
        SHOW CREATE TABLE expense_type;
        SHOW CREATE TABLE invoice_leaseagrm;
        SHOW CREATE TABLE invoice_utilities;
        SHOW CREATE TABLE invoices;
        SHOW CREATE TABLE leaseagrm;
        SHOW CREATE TABLE leaseagrm_period;
        SHOW CREATE TABLE revenue;
        SHOW CREATE TABLE revenue_type;
        SHOW CREATE TABLE tenant;
        SHOW CREATE TABLE unit;
        SHOW CREATE TABLE user;
        SHOW CREATE TABLE utility_price;
        SHOW CREATE TABLE utility_reading;
    "; 

    $data = Connect::MultiQuery($sql); 

    echo '<pre>'; print_r($data); echo '</pre>'; 

    $content = ""; 
    foreach ($data as $value) 
    {
        $content.= $value["Create Table"] . "; \n\n"; 
    }

    echo "<h1 style='color:red;'>$content</h1>"; 

?>