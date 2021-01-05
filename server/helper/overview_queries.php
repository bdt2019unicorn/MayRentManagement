<?php
    namespace OverviewQueries; 
    spl_autoload_register
    (
        function($class)
        {
            if(strpos($class, __NAMESPACE__)!==false) 
            {
                $path = realpath("{$class}.php"); 
                echo $path; 
                require_once($path);
            }
        }
    ); 

    class GeneralOverview
    {
        public static function UserInput($controller)
        {
            $path = __DIR__ . "/../user_input_controller/{$controller}.json"; 
            $path = realpath($path); 
            if(!$path)
            {
                return false; 
            }
            $invoice_user_input = file_get_contents($path); 
            return json_decode($invoice_user_input, true); 
        }

        use OverviewTrait
        {
            __construct as private Contruct; 
            GetArray as private TraitGetArray; 
            Conditions as private TraitConditions; 
        }

        public $class; 
        public function __construct($edit, $building_id, $id, $controller)
        {
            $this->Contruct($edit, $building_id, $id); 
            $controller = ucfirst($controller); 
            $this->class = __NAMESPACE__ . "\\{$controller}"; 
        }

        public function GetArray($method)
        {
            return call_user_func_array("{$this->class}::{$method}", [$this->edit, $this->building_id, $this->id]); 
        }
    }

    class Invoices 
    {
        public static function RentId()
        {
            $invoice_user_input = GeneralOverview::UserInput("invoice"); 
            return $invoice_user_input? $invoice_user_input["rent_id"]: null; 
        }
    }
?>