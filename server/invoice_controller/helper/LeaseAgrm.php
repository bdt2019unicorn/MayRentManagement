<?php 
    require_once("../../helper/database.php"); 
    require_once("../../helper/overview_queries.php"); 

    Trait LeaseAgrm
    {
        private $leaseagrm_id, $rent_id, $total_paid_amount, $total_invoice_amount, $start_lease; 
        function __construct($leaseagrm_id)
        {
            $this->leaseagrm_id = $leaseagrm_id; 
            $this->rent_id = OverviewQueries\Invoices::RentId(); 
            $this->total_paid_amount = OverviewQueries\LeaseAgrm::TotalPaidAmountQuery(); 
            $this->total_invoice_amount = OverviewQueries\LeaseAgrm::$TotalInvoiceAmountQuery; 
        }

        private function LeaseAgrm()
        {

        }



        private function StartDate()
        {
            
        }
    }

?>