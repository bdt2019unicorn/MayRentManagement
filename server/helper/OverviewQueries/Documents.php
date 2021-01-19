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

        public function Documents($test_mode = false)
        {
            $conditions = ($this->id)?"`id` = '{$this->id}'": "`unit_id` IN (SELECT `id` FROM `unit` WHERE `building_id` = '{$this->building_id}')"; 
            return 
            "
                {$this->SelectQuery($test_mode)}
                {$conditions}; 
            "; 
        }

        public function DocumentsByUnit($unit_id, $test_mode = false)
        {
            return 
            "
                {$this->SelectQuery($test_mode)}
                `unit_id` = '{$unit_id}'; 
            "; 
        }

        private function SelectQuery($test_mode = false)
        {
            $upload_time = $test_mode? "STRFTIME('%d/%m/%Y %H:%M:%S', `modified_time`)": "DATE_FORMAT(`modified_time`, '%D %M %Y %H:%i:%S')"; 
            return
            "
                SELECT 
                    `id` AS `ID`, 
                    `name` AS `Name`, 
                    `document_type_id`, 
                    (SELECT `document_type`.`name` FROM `document_type` WHERE `document_type`.`id` = `documents`.`document_type_id`) AS `Type`, 
                    `unit_id`, 
                    (SELECT `unit`.`name` FROM `unit` WHERE `unit`.`id` = `documents`.`unit_id`) AS `Unit`, 
                    `file_extension`, 
                    `description` AS `Description`, 
                    `username` AS `Uploader`, 
                    {$upload_time} AS `Uploaded Time`
                FROM `documents`
                WHERE 
            "; 
        }

    }

?>