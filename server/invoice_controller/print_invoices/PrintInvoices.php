<?php 
    namespace PrintInvoices; 
    require_once("./helper.php"); 
    class General 
    {
        public $invoices; 
        private $logo_image; 
        private $building_information; 
        function __construct($building_id)
        {
            $this->logo_image = $this->Base64Logo(); 
            $this->PopulateInvoiceData($building_id); 
        }

        private function PopulateInvoiceData($building_id)
        {
            $sql = \Query::GeneralData("buildings", $building_id) . 
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
            $data = \Connect::MultiQuery($sql, true); 
            $this->building_information = $data[0][0];
            $this->invoices = $data[1]; 
        }
        
        private function Base64Logo()
        {
            $path = realpath(__DIR__ . "../../../../img/logo.jpeg"); 
            $image = file_get_contents($path); 
            $base64 = base64_encode($image); 
            return "data:image/jpeg;base64,{$base64}"; 
        }

        public function Pdf()
        {
            $doc_definition = 
            [
                "pageSize" => 'A4',
                "content" => 
                [
                    [
                        "image" => $this->logo_image, 
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
                                "Account name: {$this->building_information['account_name']}",
                                "Account number: {$this->building_information['account_number']}",
                                [
                                    "text" => "Bank: {$this->building_information['bank']}", 
                                    "link" => $this->building_information["bank_link"], 
                                    "color" => "blue"
                                ],
                                "Branch: {$this->building_information['bank_branch']}"
                            ], 
                            "width" => "70%"
                        ], 
                        [
                            "stack" => 
                            [
                                "For and on behalf of ", 
                                [
                                    "text" => $this->building_information["company"], 
                                    "bold" => true 
                                ], 
                                [
                                    "text" => " ", 
                                    "lineHeight" => 3
                                ], 
                                "Authorized Signature", 
                                [
                                    "text" => "{$this->building_information['authorize_signature']}\n{$this->building_information['authorize_title']}", 
                                    "bold" => true 
                                ], 
                                [
                                    "text" => $this->building_information["email"], 
                                    "link" => "mailto: {$this->building_information['email']}"
                                ], 
                                "Phone No. {$this->building_information['phone']}", 
                                [
                                    "text" => $this->building_information["address"], 
                                    "italics" => true  
                                ]
                            ], 
                            "width" => "*"
                        ]
                    ] 
                ]
            ]; 

            return 
            [
                "doc_definition" => $doc_definition, 
                "content_footer" => $content_footer
            ]; 
        }

        public function Layout()
        {
            $html_footer = 
            "
                <div class='container-fluid'>
                    <div class='row'>
                        <div class='col-7'>
                            Please make transfer payment to <br> 
                            Account name: <b>{$this->building_information['account_name']}</b><br>
                            Account number: <b>{$this->building_information['account_number']}</b><br>
                            Bank: <a href='{$this->building_information['bank_link']}'><b>{$this->building_information['bank']}</b></a><br>
                            Branch: <b>{$this->building_information['bank_branch']}</b><br>
                        </div>
        
                        <div class='col-5'>
                            For and on behalf of <br>
                            <b>{$this->building_information["company"]}</b><br>
                            <br><br><br>
                            Authorized Signature<br>
                            <b>{$this->building_information['authorize_signature']}</b><br>
                            <b>{$this->building_information['authorize_title']}</b><br>
                            <a href='mailto: {$this->building_information["email"]}'>{$this->building_information["email"]}</a><br>
                            Phone No. {$this->building_information['phone']}<br>
                            <pre class='font-italic'>{$this->building_information["address"]}</pre>
                        </div>
                    </div>
                </div>
            "; 
            return 
            [
                "display" =>
                [
                    "id" =>"ID", 
                    "name" => "Invoice Name", 
                    "leaseagrm" => "Contract",
                    "grand_total" => "Amount"
                ], 
                "html" => 
                [
                    "image" => $this->logo_image, 
                    "footer" => $html_footer
                ]
            ]; 
        }
    }
?>