<?php 
    require_once("../helper/database.php"); 
    use PhpOffice\PhpSpreadsheet\Spreadsheet;
    use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet; 
    use PhpOffice\PhpSpreadsheet\NamedRange; 
    use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
    use PhpOffice\PhpSpreadsheet\Cell\DataValidation; 

    // $data = Connect::GeneralData("tenant"); 

    require_once("SampleCellStyles.php"); 

    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    $sheet->setTitle("First Sheet"); 






    // $col_count = 0; 

    // for ($i=0; $i < count($data) ; $i++) 
    // { 
    //     // $cell = $i+1; 
    //     $column = ord("A")-1;

    //     foreach ($data[$i] as $key => $value) 
    //     {
    //         $column++; 
    //         $cell = chr($column); 
    //         if($i==0)
    //         {
    //             $col_count = count($data[$i]); 
    //             $sheet->setCellValue($cell."1", $key); 
    //         }
            
    //         $sheet->setCellValue($cell.strval($i+2), $value); 
    //     } 
    // }


    // $range = "=\$A\$1:\$". chr(ord("A")-1+$col_count)."\$". strval(count($data)+1); 

    // echo $range; 

    // $spreadsheet->addNamedRange(new NamedRange("tenants", $sheet, $range)); 

    // $second_sheet = new Worksheet($spreadsheet, "Second Sheet"); 
    // $validation = $second_sheet->getCell('A1')->getDataValidation();
    // $validation->setType(DataValidation::TYPE_LIST); 
    // $row_end = count($data) + 1; 
    // $validation->setFormula1("='First Sheet'!B2:B{$row_end}"); 
    // $validation->setShowDropDown(true); 

    // $spreadsheet->addSheet($second_sheet); 

    // $sheet->setCellValue('A1', 'Hello World !');

    $writer = new Xlsx($spreadsheet);
    $directory = "templates/"; 
    if(!file_exists($directory))
    {
        mkdir($directory);    
    }

    $writer->save('templates/test.xlsx');

    // echo '<pre>'; 
    // print_r($data); 
    // echo '</pre>'; 


    class Outer
    {
        function __construct()
        {
            echo "<h1>contruct</h1>"; 
        }

        // private class Inner
        // {
        //     function __construct()
        //     {
        //         echo "<h1 style='color:red;'>inner</h1>"; 
        //     }
        // }

        public function Test()
        {
            // $inner = new Inner(); 
            echo "<h2>Inner created</h2>"; 
        }
    }


    $outer = new Outer(); 
    $outer->Test(); 
?>