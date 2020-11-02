<?php 
    require_once("../helper/database.php"); 
    use PhpOffice\PhpSpreadsheet\Spreadsheet;
    use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet; 
    use PhpOffice\PhpSpreadsheet\NamedRange; 
    use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
    use PhpOffice\PhpSpreadsheet\Cell\DataValidation; 
    use PhpOffice\PhpSpreadsheet\IOFactory; 


    $file_name = "unit-template.xlsx"; 
    $spreadsheet = IOFactory::load($file_name); 
    $spreadsheet->setActiveSheetIndexByName("Data"); 
    $sheet = $spreadsheet->getActiveSheet(); 

    $style_array = $sheet->getStyle("A1");

    echo '<pre>'; 
    print_r($style_array); 
    echo '</pre>'; 





?>