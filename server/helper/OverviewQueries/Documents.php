<?php 
    namespace OverviewQueries; 
    require_once("OverviewTrait.php"); 
    class Documents 
    {
        use OverviewTrait 
        {
            Conditions as private TraitConditions; 
        }
        
        public static function File($document_id)
        {
            return "SELECT `file` FROM `documents` WHERE `id` = '{$document_id}';"; 
        } 

        public function Documents()
        {
            $conditions = ($this->id)?"`id` = '{$this->id}'": "`unit` IN (SELECT `id` FROM `unit` WHERE `building_id` = '{$this->building_id}')"; 
            return 
            "
                {$this->SelectQuery}
                {$conditions}; 
            "; 
        }

        public function DocumentsByUnit($unit_id)
        {
            return 
            "
                {$this->SelectQuery}
                `unit` = '{$unit_id}'; 
            "; 
        }

        private $SelectQuery = 
        "
            SELECT 
                `id`, 
                `name` AS `Name`, 
                `document_type_id`, 
                (SELECT `document_type`.`name` FROM `document_type` WHERE `document_type`.`id` = `documents`.`document_type_id`) AS `Type`, 
                `unit_id`, 
                (SELECT `unit`.`name` FROM `unit` WHERE `unit`.`id` = `documents`.`unit_id`) AS `Unit`, 
                `file_extension`, 
                `description` AS `Description`, 
                `username` AS `Uploader`, 
                `modified_date` AS `Uploaded Time`
            FROM `documents`
            WHERE 
        "; 


        
    }

?>