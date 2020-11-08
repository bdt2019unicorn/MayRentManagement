<?php 
    ob_start();
    require_once("ExcelSpreadSheet.php"); 
    use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

    $controller = $_GET["controller"]; 
    $excel_spreadsheet = new ExcelSpreadSheet($controller, $_GET["building_id"]??null); 
    $spreadsheet = $excel_spreadsheet->GenerateSpreadsheet(); 

    ob_get_clean(); 
    $writer = new Xlsx($spreadsheet);
    header( "Content-Type: application/vnd.ms-excel" );
    header("Content-disposition: attachment; filename={$controller}-template.xlsx"); 
    $writer->save("php://output"); 
?>