<?php 

    require_once("ExcelSpreadSheet.php"); 

    use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

    $controller = "buildings"; 

    function ExportToFile($spreadsheet)
    {
        $writer = new Xlsx($spreadsheet);

        $directory = "templates/"; 
        if(!file_exists($directory))
        {
            mkdir($directory);    
        }

        $writer->save('templates/buildings.xlsx');
    }

    $excel_spreadsheet = new ExcelSpreadSheet($controller); 

    $spreadsheet = $excel_spreadsheet->GenerateSpreadsheet(); 

    ExportToFile($spreadsheet); 

?>