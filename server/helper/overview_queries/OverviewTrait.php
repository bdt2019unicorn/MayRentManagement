<?php
    namespace OverviewQueries; 
    trait OverviewTrait 
    {
        public $edit; 
        public $building_id; 
        public $id; 

        public function __construct($edit, $building_id, $id)
        {
            $this->edit = $edit; 
            $this->building_id = $building_id; 
            $this->id = $id; 
        }

        public function GetArray($method)
        {
            return call_user_func_array(__CLASS__ . "::{$method}", [$this->edit, $this->building_id, $this->id]); 
        }

        public static function Conditions($edit, $building_id, $id)
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