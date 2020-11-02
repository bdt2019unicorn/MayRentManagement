<?php 
    require_once("../helper/database.php"); 
    use PhpOffice\PhpSpreadsheet\Spreadsheet;
    use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet; 
    use PhpOffice\PhpSpreadsheet\NamedRange; 
    use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
    use PhpOffice\PhpSpreadsheet\Cell\DataValidation; 
    use PhpOffice\PhpSpreadsheet\IOFactory; 


    function CellStyles()
    {
        $file_name = "unit-template.xlsx"; 
        $spreadsheet = IOFactory::load($file_name); 
        $spreadsheet->setActiveSheetIndexByName("Data"); 
        $sheet = $spreadsheet->getActiveSheet(); 
    
        $styles = $sheet->getStyle("A1");
        return $styles; 
    }


    function MergeStyle()
    {
        $file_name = "unit-template.xlsx"; 
        $spreadsheet = IOFactory::load($file_name); 
        $spreadsheet->setActiveSheetIndexByName("Data"); 
        $sheet = $spreadsheet->getActiveSheet(); 

        $styles = $sheet->getStyle("B5"); 
        return $styles; 
    }








?>