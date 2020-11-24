<?php 
    require_once("./helper.php"); 
    use PhpOffice\PhpSpreadsheet\Spreadsheet;
    use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet; 
    use PhpOffice\PhpSpreadsheet\NamedRange; 
    use PhpOffice\PhpSpreadsheet\Cell\DataValidation; 
    use PhpOffice\PhpSpreadsheet\IOFactory; 


    $path = "print-invoices/test_excel_invoice.xlsx"; 
    $spreadsheet = IOFactory::load($path);
    

    $writer = new \PhpOffice\PhpSpreadsheet\Writer\Html($spreadsheet); 
    $writer->setSheetIndex(0);
    echo $writer->generateSheetData(); 
    $writer->save("print-invoices/test_excel_invoice.html"); 
?>