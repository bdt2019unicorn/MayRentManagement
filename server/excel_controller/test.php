<?php 
    require_once("../helper/database.php"); 
    use PhpOffice\PhpSpreadsheet\Spreadsheet;
    use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet; 
    use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

    $data = Connect::GeneralData("tenant"); 

    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    $sheet->setTitle("First Sheet"); 
    // $sheet = new Worksheet($spreadsheet, "First Sheet"); 

    for ($i=0; $i < count($data) ; $i++) 
    { 
        // $cell = $i+1; 
        $column = ord("A")-1;

        foreach ($data[$i] as $key => $value) 
        {
            $column++; 
            $cell = chr($column); 
            if($i==0)
            {
                $sheet->setCellValue($cell."1", $key); 
            }
            
            $sheet->setCellValue($cell.strval($i+2), $value); 
        } 

        // if($i==0)
        // {
        //     $column = ord("A")-1;
        //     foreach ($data[$i] as $key => $value) 
        //     {
        //         $column++; 
        //         $cell = chr($column) ."1"; 
        //         $sheet->setCellValue($cell, $key); 
        //     } 
        // }
        // $sheet->setCellValue("A{$cell}", json_encode($data[$i])); 
    }

    // $spreadsheet->addSheet($sheet); 

    // $sheet->setCellValue('A1', 'Hello World !');

    $writer = new Xlsx($spreadsheet);
    $writer->save('hello world.xlsx');

    // echo '<pre>'; 
    // print_r($data); 
    // echo '</pre>'; 
?>