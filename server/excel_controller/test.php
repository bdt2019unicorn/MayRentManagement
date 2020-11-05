<?php 

    require_once("ExcelSpreadSheet.php"); 

    use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

    $controller = "tenant";
    $building_id = 1;  

    function ExportToFile($spreadsheet)
    {
        global $controller; 
        $writer = new Xlsx($spreadsheet);

        $directory = "templates/"; 
        if(!file_exists($directory))
        {
            mkdir($directory);    
        }

        $writer->save("templates/$controller-test.xlsx");
    }

    $excel_spreadsheet = new ExcelSpreadSheet($controller, $building_id); 

    $spreadsheet = $excel_spreadsheet->GenerateSpreadsheet(); 

    ExportToFile($spreadsheet); 

?>