<?php
    namespace OverviewQueries; 
    trait OverviewTrait 
    {
        public $edit; 
        public $building_id; 
        public $id; 
        public $test_mode; 

        public function __construct($edit, $building_id, $id, $test_mode=false)
        {
            $this->edit = $edit; 
            $this->building_id = $building_id; 
            $this->id = $id; 
            $this->test_mode = $test_mode; 
        }

        public function GetArray($method)
        {
            return call_user_func_array(__CLASS__ . "::{$method}", [$this->edit, $this->building_id, $this->id, $this->test_mode]); 
        }

        public static function Conditions($edit, $building_id, $id, $test_mode=false)
        {
            if($id)
            {
                return ["id"=>$id]; 
            }
            else if($building_id)
            {
                return ["building_id"=>$building_id]; 
            }
            return null; 
        }

    }
?>