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
            echo '<pre>'; 
            print_r($_POST); 
            echo '</pre>'; 
        }
    }

    $actions = new Actions($_GET["command"]); 
?>