<?php 
    require_once("./helper.php"); 
    use PhpOffice\PhpSpreadsheet\Spreadsheet;
    use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet; 
    use PhpOffice\PhpSpreadsheet\NamedRange; 
    use PhpOffice\PhpSpreadsheet\Cell\DataValidation; 
    use PhpOffice\PhpSpreadsheet\IOFactory; 


    // $path = "print-invoices/test_excel_invoice.xlsx"; 
    // $spreadsheet = IOFactory::load($path);
    

    // $writer = new \PhpOffice\PhpSpreadsheet\Writer\Html($spreadsheet); 
    // $writer->setSheetIndex(0);
    // echo $writer->generateSheetData(); 
    // $writer->save("print-invoices/test_excel_invoice.html"); 
    $building_id = $_GET["building_id"]; 

    function Base64Logo()
    {
        $image = file_get_contents("../../img/logo.jpeg"); 
        $base64 = base64_encode($image); 
        return "data:image/jpeg;base64,{$base64}"; 
    }

    $sql = Query::GeneralData("buildings", $building_id) . 
    "
        SELECT 
            *, 
            (
                SELECT `unit`.`name` FROM `unit` 
                WHERE `unit`.`id` = 
                (
                    SELECT `leaseagrm`.`unit_id` FROM `leaseagrm` 
                    WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`
                )
            ) AS `unit`, 
            (
                SELECT CONCAT(IFNULL(`tenant`.`Last_Name`,''), ' ', IFNULL(`tenant`.`First_Name`,'')) 
                FROM `tenant` 
                WHERE `tenant`.`id` = 
                (
                    SELECT `leaseagrm`.`Tenant_ID` FROM `leaseagrm` 
                    WHERE `invoices`.`leaseagrm_id` = `leaseagrm`.`id`
                )
            ) AS `tenant` 
        FROM `invoices` 
        WHERE `leaseagrm_id` IN 
        (
            SELECT `leaseagrm`.`id` FROM `leaseagrm` 
            WHERE `leaseagrm`.`unit_id` IN 
            (
                SELECT `unit`.`id` FROM `unit` WHERE `building_id` = '{$building_id}'
            )
        ); 
    "; 

    $data = Connect::MultiQuery($sql, true); 
    $building_information = $data[0][0];
    $invoices = $data[1]; 
    $all_invoices_information = []; 
    foreach ($invoices as $invoice) 
    {
        $invoice_id = $invoice["id"]; 
        $query = InvoiceDetails($invoice_id); 
        $invoice_details = Connect::MultiQuery($query, true); 
        
        $details = 
        [
            "id" => $invoice_id, 
            "invoice" =>$invoice, 
            "details" => 
            [
                "leaseagrm" =>$invoice_details[0], 
                "utilities" =>$invoice_details[1]
            ]
        ]; 

        array_push($all_invoices_information, $details); 
    }
    
    $print_invoices = 
    [
        "image"=> Base64Logo(), 
        "building_information"=> $building_information, 
        "invoices"=>$all_invoices_information
    ]; 

    echo json_encode($print_invoices); 


?>