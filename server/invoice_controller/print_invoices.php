<?php 
    namespace PrintInvoices; 
    require_once("print_invoices/General.php"); 

    class Actions
    {
        function __construct($command)
        {
            if(method_exists($this, $command))
            {
                $this->$command(); 
            }
            else 
            {
                echo false; 
            }
        }

        private function General()
        {
            $building_id = $_GET["building_id"]; 
            $print_invoices_general = new General($building_id); 
            echo json_encode($print_invoices_general->PrintInvoices()); 
        }

        private function Excel()
        {
            $image = json_decode($_POST["image"]); 
            $invoices = json_decode($_POST["invoices"], true); 
            $footer_array = json_decode($_POST["footer_array"], true); 

            $print_excel = new Excel($invoices, $image, $footer_array, realpath("temp/")); 
            $path = $print_excel->ZipAllExcel(); 
            if($path)
            {
                require_once("../helper/support.php"); 
                DownloadFile($path); 
                @unlink($path);
                $print_excel->ResolveFolder(); 
            }
        }
    }

    $actions = new Actions($_GET["command"]); 
?>