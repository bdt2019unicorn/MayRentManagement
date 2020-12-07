<?php 
    require_once("./helper.php"); 
    require_once("print_invoices/Excel.php"); 
    use PhpOffice\PhpSpreadsheet\Spreadsheet;
    use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet; 
    use PhpOffice\PhpSpreadsheet\NamedRange; 
    use PhpOffice\PhpSpreadsheet\Cell\DataValidation; 
    use PhpOffice\PhpSpreadsheet\Reader; 
    use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
    use PhpOffice\PhpSpreadsheet\Worksheet\MemoryDrawing; 


    // $building_information = Connect::GeneralData("buildings", "5"); 
    // $building_information = $building_information[0]; 

    // $footer_array = PrintInvoices\Excel::FooterArray($building_information); 

    // echo '<pre>'; 
    // print_r($building_information); 
    // print_r($footer_array); 
    // echo '</pre>'; 

    // $html_helper = new PhpOffice\PhpSpreadsheet\Helper\Html(); 

    // $rich_text_convert = []; 

    // foreach ($footer_array as $row) 
    // {
    //     $rich_text_row = []; 
    //     foreach ($row as $cell) 
    //     {
    //         $rich_text = $cell? $html_helper->toRichTextObject($cell): null; 
    //         array_push($rich_text_row, $rich_text); 
    //     }
    //     array_push($rich_text_convert, $rich_text_row); 
    // }


    $spreadsheet = new Spreadsheet(); 
    $sheet = $spreadsheet->getActiveSheet(); 
    // $sheet->fromArray($rich_text_convert, null, "C3"); 




    function Base64Logo()
    {
        $path = realpath(__DIR__ . "../../../img/logo.png"); 
        $image = file_get_contents($path); 
        $base64 = base64_encode($image); 
        return "data:image/jpeg;base64,{$base64}"; 
    }

    $image = Base64Logo();
    // echo $image;  
    $png = imagecreatefrompng($image); 
    // header('Content-Type: image/png');
    // imagepng($png); 


    $drawing = new MemoryDrawing(); 
    $drawing->setImageResource($png); 
    $drawing->setCoordinates("B4"); 
    $drawing->setWorksheet($sheet); 




    $writer = new Xlsx($spreadsheet); 
    $writer->save("temp/test-image.xlsx"); 

?>