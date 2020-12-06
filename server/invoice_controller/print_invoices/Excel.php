<?php 
    namespace PrintInvoices; 
    require_once("./helper.php"); 
    use PhpOffice\PhpSpreadsheet\Spreadsheet; 
    use PhpOffice\PhpSpreadsheet\Worksheet\MemoryDrawing; 

    use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

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
                    fn($address)=>array_merge([""], $space, ["<i>{$address}</i>"]),  
                    explode("\n", $building_information["address"])
                )
            ); 
        }

        private $inovices; 
        private $png_logo; 
        private $footer_rich_text; 
        private $temp_path; 

        function __construct($inovices, $image, $footer_array, $temp_path)
        {
            $this->inovices = $inovices; 
            $this->png_logo = imagecreatefrompng($image); 
            $this->footer_rich_text = $this->RichTextArrayConvert($footer_array); 
            $this->temp_path = $temp_path; 
        }

        public function ZipAllExcel()
        {
            $invoice = $this->inovices[0]; 
            $this->CreateExcelFile($invoice); 
        }

        private function CreateExcelFile($invoice)
        {
            $spreadsheet = new Spreadsheet(); 
            $sheet = $spreadsheet->getActiveSheet();

            $drawing = new MemoryDrawing(); 
            $drawing->setImageResource($this->png_logo); 
            $drawing->setCoordinates("D1"); 
            $drawing->setWorksheet($sheet); 
        
            echo "<pre>"; 
            print_r($invoice); 
            echo "</pre>"; 

            $header = 
            [
                ["Date", ":", date("d-M-Y"), "", "", "ROE:"],
                ["Inoice", ":", $invoice["invoice"]["name"]],
                ["To", ":", "<b>{$invoice['invoice']['tenant']}</b>"],
                ["", "", "{$invoice['invoice']['unit']}"]
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
                    "outline"=>["borderStyle"=>"thin"]
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
            $sheet->getColumnDimension("I")->setWidth(28); 
            $SheetTitle(); 
            $row_position+= count($header)+1; 
            $SheetSubTitle("B{$row_position}", "DESCRIPTION", "left", "B{$row_position}:H{$row_position}"); 
            $SheetSubTitle("I{$row_position}", "VND", "right"); 

            $AlignmentStyle = fn($alignment)=>["alignment"=>["horizontal"=>$alignment]]; 
            $right_number_detail_styles = array_merge($range_styles, $AlignmentStyle("right")); 

            $LeaseagrmRow = function($index, $leaseagrm) use ($sheet, &$row_position, $range_styles, $AlignmentStyle, $right_number_detail_styles)
            {
                $range = "B{$row_position}:H{$row_position}"; 
                $sheet->getCell("B{$row_position}")->setValue("{$index}.{$leaseagrm['name']}"); 
                $sheet->getStyle($range)->applyFromArray(array_merge($range_styles, $AlignmentStyle("left"))); 
                $sheet->mergeCells($range); 

                $sheet->getCell("I{$row_position}")->setValue(number_format(floatval($leaseagrm['amount']), 0, ".", ",")); 
                $sheet->getStyle("I{$row_position}")->applyFromArray($right_number_detail_styles); 

                $row_position++; 
            }; 

            $index = 1; 
            $row_position++; 
            foreach ($invoice["details"]["leaseagrm"] as $leaseagrm) 
            {
                $LeaseagrmRow($index, $leaseagrm); 
                $index++; 
            }

            $writer = new Xlsx($spreadsheet); 
            $writer->save("{$this->temp_path}/test-invoice-new-{$invoice['id']}.xlsx"); 
        }

        private function RichTextArrayConvert($array)
        {
            $html_helper = new \PhpOffice\PhpSpreadsheet\Helper\Html(); 
            return array_map(fn($row)=>array_map(fn($cell)=> $cell? $html_helper->toRichTextObject($cell): null,$row), $array); 
        }
    }
?>