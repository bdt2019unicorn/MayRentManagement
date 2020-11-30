<?php 
    require_once("./helper.php"); 
    require_once("print_invoices/Excel.php"); 
    use PhpOffice\PhpSpreadsheet\Spreadsheet;
    use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet; 
    use PhpOffice\PhpSpreadsheet\NamedRange; 
    use PhpOffice\PhpSpreadsheet\Cell\DataValidation; 
    use PhpOffice\PhpSpreadsheet\Reader; 
    use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

    $html = file_get_contents("print-invoices/footer-test.html"); 

    $reader = new Reader\Html(); 
    $spreadsheet = $reader->loadFromString($html); 
    $writer = new Xlsx($spreadsheet); 
    $writer->save("print-invoices/test-excel-result.xlsx"); 

    echo $html; 


?>