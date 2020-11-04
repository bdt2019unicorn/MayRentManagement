<?php 
    require_once("ExcelSpreadSheet.php"); 

    use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

    $controller = "leaseagrm"; 
    $building_id = 2; 

    function ExportToFile($spreadsheet)
    {
        $writer = new Xlsx($spreadsheet);

        $directory = "templates/"; 
        if(!file_exists($directory))
        {
            mkdir($directory);    
        }
    
        $writer->save('templates/leaseagrm_test_php.xlsx');
    }

    $excel_spreadsheet = new ExcelSpreadSheet($controller, $building_id); 

    $spreadsheet = $excel_spreadsheet->GenerateSpreadsheet(); 

    ExportToFile($spreadsheet); 
?>