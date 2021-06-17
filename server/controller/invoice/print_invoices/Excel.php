<?php 
    namespace PrintInvoices; 
    require_once("./helper.php");
    use PhpOffice\PhpSpreadsheet\Spreadsheet; 
    use PhpOffice\PhpSpreadsheet\Worksheet\MemoryDrawing; 
    use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
    use glen\FilenameNormalizer\Normalizer;

    class Excel 
    {
        public static function FooterArray($building_information)
        {
            $space = array_fill(0,6,""); 
            return array_merge
            (
                [
                    array_merge(["Please make transfer payment to"], $space, ["For and on behalf of"]), 
                    array_merge(["Account name: <b>{$building_information['account_name']}</b>"], $space, ["<b>{$building_information["company"]}</b>"]), 
                    array_merge(["Account number: <b>{$building_information['account_number']}</b>"], $space, [""]), 
                    array_merge(["Bank: <a href='{$building_information['bank_link']}'><b>{$building_information['bank']}</b></a></b>"], $space, [""]), 
                    array_merge(["Branch: <b>{$building_information['bank_branch']}</b>"], $space, [""]), 
                    array_merge([""], $space, ["Authorized Signature"]), 
                    array_merge([""], $space, ["<b>{$building_information['authorize_signature']}</b>"]), 
                    array_merge([""], $space, ["<b>{$building_information['authorize_title']}</b>"]), 
                    array_merge([""], $space, ["<a href='mailto: {$building_information["email"]}'>{$building_information["email"]}</a>"]), 
                    array_merge([""], $space, ["Phone No. {$building_information['phone']}"]), 
                ], 
                array_map 
                (
                    function($address)use($space){return array_merge([""], $space, ["<i>{$address}</i>"]);},  
                    explode("\n", $building_information["address"])
                )
            ); 
        }

        private $invoices; 
        private $png_logo; 
        private $footer_rich_text; 
        private $temp_path; 
        private $folder; 

        function __construct($invoices, $image, $footer_array, $temp_path)
        {
            $this->invoices = $invoices; 
            $this->png_logo = imagecreatefrompng($image); 
            $this->footer_rich_text = $this->RichTextArrayConvert($footer_array); 
            $this->temp_path = realpath($temp_path); 
            $this->folder = "{$temp_path}/invoices"; 
        }

        public function ZipAllExcel()
        {
            $this->ResolveFolder(); 
            mkdir($this->folder); 
            $this->folder = realpath($this->folder); 
            foreach($this->invoices as $invoice)
            {
                $this->CreateExcelFile($invoice); 
            }
            $zip = new \ZipArchive(); 
            $zip->open("{$this->temp_path}/AllInvoices.zip", \ZipArchive::CREATE | \ZipArchive::OVERWRITE); 
            foreach (scandir($this->folder) as $file) 
            {
                if(!is_dir("{$this->folder}/{$file}")) $zip->addFile("{$this->folder}/{$file}", "invoices/{$file}"); 
            }
            $zip->close(); 
            return "{$this->temp_path}/AllInvoices.zip"; 
        }

        public function ResolveFolder()
        {
            if(file_exists($this->folder))
            {
                foreach (scandir($this->folder) as $file) 
                {
                    if(!is_dir("{$this->folder}/{$file}")) unlink("{$this->folder}/{$file}"); 
                }
                rmdir($this->folder); 
            }
        }

        private function CreateExcelFile($invoice)
        {
            $spreadsheet = new Spreadsheet(); 
            $sheet = $spreadsheet->getActiveSheet();

            $drawing = new MemoryDrawing(); 
            $drawing->setImageResource($this->png_logo); 
            $drawing->setCoordinates("D1"); 
            $drawing->setWorksheet($sheet); 

            $header = 
            [
                ["Date", ":", date("d-M-Y")],
                ["Inoice", ":", $invoice["invoice"]["name"]],
                ["To", ":", "<b>{$invoice['invoice']['tenant']}</b>"],
                ["", "", "{$invoice['invoice']['unit']}"], 
                ["Company", ":", "<b>{$invoice['invoice']['company']}</b>"]
            ]; 

            $CellValuesStyles = function($cell, $styles, $text=null) use ($sheet)
            {
                $sheet->getCell($cell)->setValue($text); 
                $sheet->getStyle($cell)->applyFromArray($styles); 
            }; 

            $SheetTitle =function() use ($sheet, $CellValuesStyles)
            {
                $cell= "A7"; 
                $range = "A7:I7"; 
                $styles = 
                [
                    "font"=>
                    [
                        "size"=>18
                    ], 
                    "alignment"=>
                    [
                        "horizontal"=>"center"
                    ]
                ]; 
                $CellValuesStyles($cell, $styles, "RENTAL AND UTILITY CHARGE"); 
                $sheet->mergeCells($range); 
            }; 
            
            $range_styles = 
            [
                "borders" =>
                [
                    "outline"=>["borderStyle"=>"medium"]
                ]
            ]; 

            $SheetSubTitle = function($cell, $text, $alignment, $range=null) use ($sheet, $CellValuesStyles, $range_styles)
            {
                $range = $range??$cell; 

                $cell_styles = 
                [
                    "font" =>
                    [
                        "size"=>14, 
                        "bold"=>true 
                    ], 
                    "alignment"=>
                    [
                        "horizontal"=>$alignment
                    ]
                ]; 
                $CellValuesStyles($cell, $cell_styles, $text); 
                $sheet->getStyle($range)->applyFromArray($range_styles); 
            }; 

            $header_rich_text = $this->RichTextArrayConvert($header); 

            $row_position = 8; 
            $sheet->fromArray($header_rich_text, null, "B{$row_position}"); 
            $sheet->getColumnDimension("I")->setWidth(20); 
            $SheetTitle(); 
            $row_position+= count($header)+1; 
            $SheetSubTitle("B{$row_position}", "DESCRIPTION", "left", "B{$row_position}:H{$row_position}"); 
            $SheetSubTitle("I{$row_position}", "VND", "right"); 

            $AlignmentStyle = function($alignment){return ["alignment"=>["horizontal"=>$alignment]];};  
            $right_number_detail_styles = array_merge($range_styles, $AlignmentStyle("right")); 

            $NumberFormat = function($value){return number_format(floatval($value), 0, ".", ",");};  

            $LeaseagrmRow = function($index, $leaseagrm) use ($sheet, &$row_position, $range_styles, $AlignmentStyle, $NumberFormat, $right_number_detail_styles)
            {
                $range = "B{$row_position}:H{$row_position}"; 
                $sheet->getCell("B{$row_position}")->setValue("{$index}. {$leaseagrm['name']}"); 
                $sheet->getStyle($range)->applyFromArray(array_merge($range_styles, $AlignmentStyle("left"))); 
                $sheet->mergeCells($range); 

                $sheet->getCell("I{$row_position}")->setValue($NumberFormat($leaseagrm['amount'])); 
                $sheet->getStyle("I{$row_position}")->applyFromArray($right_number_detail_styles); 

                $row_position++; 
            }; 

            $UtilityRow =function($index, $utility) use ($sheet, &$row_position, $range_styles, $NumberFormat, $right_number_detail_styles)
            {
                $DateFormat = function($date){return (new \DateTime($date))->format("h:iA jS M Y");};  
                $details = 
                [
                    ["{$index}. {$utility['name']}"], 
                    ["Begining", $DateFormat($utility['previous_date']), "", "", "", $NumberFormat($utility['previous_number'])], 
                    ["Finishing", $DateFormat($utility['date']), "", "", "", $NumberFormat($utility['number'])], 
                    ["Total", $NumberFormat($utility['price']), "", "", "", $NumberFormat($utility['quantity']), "", $NumberFormat($utility['amount'])]  
                ]; 

                $end_row = $row_position + count($details) - 1; 

                $sheet->fromArray($details, null, "B{$row_position}"); 
                $sheet->getStyle("B{$row_position}:H{$end_row}")->applyFromArray($range_styles); 
                $sheet->getStyle("G{$row_position}:G{$end_row}")->getAlignment()->setHorizontal("right"); 
                $sheet->getStyle("I{$row_position}:I{$end_row}")->applyFromArray($right_number_detail_styles); 
                $sheet->mergeCells("B{$row_position}:H{$row_position}"); 
                $row_position = $end_row + 1; 
            }; 

            $index = 1; 
            $row_position++; 
            foreach ($invoice["details"]["leaseagrm"] as $leaseagrm) 
            {
                $LeaseagrmRow($index, $leaseagrm); 
                $index++; 
            }

            foreach ($invoice["details"]["utilities"] as $utility) 
            {
                $UtilityRow($index, $utility); 
                $index++; 
            }

            $SheetSubTitle("B{$row_position}", "Grand Total", "left", "B{$row_position}:H{$row_position}"); 
            $SheetSubTitle("I{$row_position}", $invoice['invoice']['grand_total'], "right"); 
            $row_position+=2; 
            $sheet->fromArray($this->footer_rich_text, null, "B{$row_position}"); 

            $writer = new Xlsx($spreadsheet); 
            $invoice_name = Normalizer::normalize($invoice['invoice']['name']); 
            $writer->save("{$this->folder}/{$invoice_name}.xlsx"); 
        }

        private function RichTextArrayConvert($array)
        {
            $html_helper = new \PhpOffice\PhpSpreadsheet\Helper\Html(); 
            return array_map(function($row) use ($html_helper){return array_map(function($cell) use ($html_helper){return $cell? $html_helper->toRichTextObject($cell): null;},$row);}, $array); 
        }
    }
?>