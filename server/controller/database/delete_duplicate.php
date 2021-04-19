<?php 
    require_once("../../helper/database.php"); 
    class DeleteDuplicate
    {
        public $controller, $test_mode; 
        private $special_columns, $selects; 
        function __construct($controller, $test_mode)
        {
            $this->controller = $controller; 
            $this->test_mode = $test_mode; 
            $this->Setup($test_mode); 
        }

        public function Action()
        {
            $all_data = Database::SelectData($this->controller, $this->selects); 

            $strings = []; 
            $duplicate = []; 
            foreach ($all_data as $index=>$values) 
            {
                $string = ""; 
                foreach ($values as $key=>$value) 
                {
                    if(!in_array($key, $this->special_columns, true))
                    {
                        $string.="\n$key: $value\n"; 
                    }
                }
                $string = trim($string); 
                $duplicate_index = array_search($string, $strings, true); 
                if($duplicate_index!==false)
                {
                    if($this->ShouldDeleteValue($values))
                    {
                        array_push($duplicate, $values["id"]); 
                    }
                    else 
                    {
                        $duplicate_values = $all_data[$duplicate_index]; 
                        if($this->ShouldDeleteValue($duplicate_values))
                        {
                            array_push($duplicate, $duplicate_values["id"]); 
                        }
                    }
                }
                else 
                {
                    $strings[$index] = trim($string); 
                }
            }

            if(count($duplicate))
            {
                $sql = "DELETE FROM {$this->controller} WHERE `id` IN (" . implode(", ", $duplicate) . ");"; 
                $result = $this->test_mode? ConnectSqlite::Exec($sql): Connect::GetData($sql); 
                echo $result; 
            }
            else 
            {
                echo true; 
            }
        }

        private function Setup()
        {
            $references = $this->References(); 

            $special_columns = ["id"]; 
            $selects = ["*"]; 
            foreach ($references as $reference) 
            {
                $table_name = $reference["TABLE_NAME"]; 
                $column_name = $reference["COLUMN_NAME"]; 
                $special_column = "$table_name-$column_name"; 
                array_push($special_columns, $special_column); 
                array_push($selects, "(SELECT `{$column_name}` FROM `{$table_name}` WHERE `{$column_name}` = `{$this->controller}`.`id` LIMIT 1) AS `{$special_column}`"); 
            }
            $this->special_columns = $special_columns; 
            $this->selects = $selects; 
        }

        private function References()
        {
            if($this->test_mode)
            {
                $sql = "SELECT * FROM `sqlite_master` WHERE `sql` LIKE '%REFERENCES `{$this->controller}`%'"; 
                $references = ConnectSqlite::Query($sql); 
            
                return array_map
                (
                    function($reference)
                    {
                        $contraints = ConnectSqlite::Query("PRAGMA FOREIGN_KEY_LIST('{$reference['name']}');"); 
                        foreach ($contraints as $contraint) 
                        {
                            if($contraint["table"]==$this->controller)
                            {
                                return 
                                [
                                    "TABLE_NAME"=> $reference['name'], 
                                    "COLUMN_NAME"=> $contraint["from"]
                                ]; 
                            }
                        }
                        return $contraints; 
                    }, 
                    $references
                ); 
            }
            else 
            {
                $sql = 
                "
                    SET @db=DATABASE(); 
                    SELECT * FROM `information_schema`.`KEY_COLUMN_USAGE` WHERE `CONSTRAINT_SCHEMA` = @db AND `REFERENCED_TABLE_NAME`='{$this->controller}'; 
                    SELECT DATABASE(); 
                "; 
            
                $references = Connect::MultiQuery($sql, true); 
                return $references[0]; 
            }
        }
        
        private function ShouldDeleteValue($values)
        {
            foreach ($this->special_columns as $column) 
            {
                if($column!="id")
                {
                    if($values[$column])
                    {
                        return false; 
                    }
                }
            }
            return true; 
        }
    }
    $delete_duplicate = new DeleteDuplicate($_GET["controller"], CurrentEnvironment::TestMode()); 
    $delete_duplicate->Action(); 
?>