<?php 
    namespace PrintInvoices; 
    require_once("./helper.php"); 
    trait Pdf 
    {   
        private function Pdf()
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
    }
?>