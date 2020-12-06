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
        
            // $sheet->fromArray($this->footer_rich_text, null, "B10"); 

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

            $SheetTitle =function() use ($sheet)
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
                        "horizontal"=> "center"
                    ]
                ]; 
                $sheet->getCell($cell)->setValue("RENTAL AND UTILITY CHARGE"); 
                $sheet->getStyle($cell)->applyFromArray($styles); 
                $sheet->mergeCells($range); 
            }; 

            $header_rich_text = $this->RichTextArrayConvert($header); 
            $sheet->fromArray($header_rich_text, null, "B8"); 
            $SheetTitle(); 

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