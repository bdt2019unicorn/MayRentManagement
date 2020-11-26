<?php 
    require_once("./helper.php"); 
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
            ) AS `tenant`, 
            (SELECT `leaseagrm`.`name` FROM `leaseagrm` WHERE `leaseagrm`.`id` = `invoices`.`leaseagrm_id`) AS `leaseagrm`, 
            FORMAT
            (
                (
                    IFNULL
                    (
                        (SELECT SUM(`invoice_leaseagrm`.`amount`) FROM `invoice_leaseagrm` WHERE `invoice_leaseagrm`.`invoice_id` = `invoices`.`id`), 
                        0
                    ) + 
                    IFNULL
                    (
                        (SELECT SUM(`invoice_utilities`.`amount`) FROM `invoice_utilities` WHERE `invoice_utilities`.`invoice_id` = `invoices`.`id`),
                        0 
                    )
                ), 3  
            ) AS `grand_total`
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
            ], 
            "checked" => false, 
            "show_details" => false 
        ]; 

        array_push($all_invoices_information, $details); 
    }

    $doc_definition = 
    [
        "pageSize" => 'A4',
        "content" => 
        [
            [
                "image" => Base64Logo(), 
                "width" => 100, 
                "alignment" => "center"
            ], 
            [
                "text" => "RENTAL AND UTILITY CHARGE", 
                "style" => "header", 
                "alignment" => "center"
            ], 
            [
                "columns" => 
                [
                    [
                        "text" => "Date", 
                        "width" => "10%"
                    ],                                 
                    [
                        "text" => ":", 
                        "width" => "5%"
                    ],                                 
                    [
                        "text" => date("d M Y"), 
                        "width" => "35%"
                    ], 
                    [
                        "text" => "", 
                        "width" => "10%"
                    ], 
                    [
                        "text" => "ROE: ", 
                        "width" => "10%"
                    ], 
                    [
                        "text" => "", 
                        "width" => "*"
                    ]
                ]
            ] 
        ], 
        "styles" => 
        [
            "header" => 
            [
                "fontSize" => 22,
                "bold" => true, 
                "margin" => [1, 5]
            ],
            "sub_heading" => 
            [
                "fontSize" => 16, 
                "bold" => true, 
                "margin" => [1, 3]
            ]
        ]
    ];

    $content_footer = 
    [
        " ", 
        [
            "columns" => 
            [
                [
                    "stack" => 
                    [
                        "Please make transfer payment to",  
                        "Account name: {$building_information['account_name']}",
                        "Account number: {$building_information['account_number']}",
                        [
                            "text" => "Bank: {$building_information['bank']}", 
                            "link" => $building_information["bank_link"], 
                            "color" => "blue"
                        ],
                        "Branch: {$building_information['bank_branch']}"
                    ], 
                    "width" => "70%"
                ], 
                [
                    "stack" => 
                    [
                        "For and on behalf of ", 
                        [
                            "text" => $building_information["company"], 
                            "bold" => true 
                        ], 
                        [
                            "text" => " ", 
                            "lineHeight" => 3
                        ], 
                        "Authorized Signature", 
                        [
                            "text" => "{$building_information['authorize_signature']}\n{$building_information['authorize_title']}", 
                            "bold" => true 
                        ], 
                        [
                            "text" => $building_information["email"], 
                            "link" => "mailto: {$building_information['email']}"
                        ], 
                        "Phone No. {$building_information['phone']}", 
                        [
                            "text" => $building_information["address"], 
                            "italics" => true  
                        ]
                    ], 
                    "width" => "*"
                ]
            ] 
        ]
    ]; 

    $layout = 
    [
        "display" =>
        [
            "id" =>"ID", 
            "name" => "Invoice Name", 
            "leaseagrm" => "Contract",
            "grand_total" => "Amount"
        ], 
        "html" => 
        []
    ]; 
        
    $print_invoices = 
    [
        "layout" => $layout, 
        "invoices" =>$all_invoices_information, 
        "pdf" => 
        [
            "doc_definition" => $doc_definition, 
            "content_footer" => $content_footer
        ]
    ]; 

    echo json_encode($print_invoices); 
?>