<?php
    namespace OverviewQueries; 
    require_once("query.php");
    require_once("support.php"); 
    spl_autoload_register
    (
        function($class)
        {
            if(strpos($class, __NAMESPACE__)!==false) 
            {
                $class = str_replace("\\", "/", $class); 
                $file = "{$class}.php";
                if(@$result = include $file)
                {
                    require_once($file);
                }
            }
        }
    ); 

    class GeneralOverview
    {
        public static function UserInput($controller, $lang)
        {
            $path = __DIR__ . "/../json/user_input/{$lang}/{$controller}.json"; 
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
            DisableError(); 
        }

        public function GetArray($method)
        {
            try 
            {
                return call_user_func_array("{$this->class}::{$method}", [$this->edit, $this->building_id, $this->id]); 
            }
            catch (\Throwable $t)
            {
                return null; 
            }
        }
    }

    class Invoices 
    {
        public static function RentId()
        {
            $invoice_user_input = GeneralOverview::UserInput("invoice", "en"); 
            return $invoice_user_input? $invoice_user_input["rent_id"]: null; 
        }
    }
?>