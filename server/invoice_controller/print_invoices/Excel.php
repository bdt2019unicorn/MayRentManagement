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
            $AddressArray = function($address_string) use ($space)
            {
                $address = explode("\n", $address_string); 
                $array = []; 
                foreach ($address as $value) 
                {
                    $row = array_merge([""], $space, ["<i>{$value}</i>"]); 
                    array_push($array, $row); 
                }
                return $array; 
            }; 
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
                $AddressArray($building_information["address"])
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
        
            $sheet->fromArray($this->footer_rich_text, null, "B10"); 

            $writer = new Xlsx($spreadsheet); 
            $writer->save("{$this->temp_path}/test-invoice-img-{$invoice['id']}.xlsx"); 
        }

        private function RichTextArrayConvert($array)
        {
            $html_helper = new \PhpOffice\PhpSpreadsheet\Helper\Html(); 
            $rich_text_convert = []; 
            foreach ($array as $row) 
            {
                $rich_text_row = []; 
                foreach ($row as $cell) 
                {
                    $rich_text = $cell? $html_helper->toRichTextObject($cell): null; 
                    array_push($rich_text_row, $rich_text); 
                }
                array_push($rich_text_convert, $rich_text_row); 
            }
            return $rich_text_convert; 
        }
    }
?>