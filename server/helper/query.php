<?php 
    class Query
    {
        static public function Insert($table, $data, $variable_data=[])
        {
            $columns = []; 
            $values = []; 

            foreach ($data as $column => $value) 
            {
                array_push($columns, "`{$column}`"); 
                array_push($values, $value=="" ? "NULL": "'{$value}'"); 
            }

            foreach ($variable_data as $column => $value) 
            {
                array_push($columns, "`{$column}`"); 
                array_push($values, $value); 
            }
            
            return "INSERT INTO `{$table}`(" . implode(",",$columns) . ") VALUES (" . implode(",", $values) . ");"; 
        }

        static public function Update($table, $data, $conditions)
        {
            return "UPDATE `{$table}`" . Query::Cause("SET", $data, ",") . Query::Cause("WHERE", $conditions, "AND") . ";"; 
        }
        
        static public function Delete($table, $id_column, $ids)
        {
            return array_map(function($id) use ($table, $id_column){return "DELETE FROM {$table} WHERE `{$id_column}` = '{$id}'";}, $ids); 
        }

        static public function SelectData($table, $selects, $conditions=null)
        {
            $sql = "SELECT ". implode(",", $selects). " FROM `{$table}` "; 
            if(isset($conditions))
            {
                $sql .= Query::Cause("WHERE", $conditions, "AND"); 
            }
            return $sql.";"; 
        }
        
        static public function GeneralData($table, $id= null, $id_field='id')
        {
            $sql = "SELECT * FROM `{$table}`"; 
            
            if($id)
            {
                $sql.= " WHERE `{$id_field}`='{$id}'"; 
            }

            return $sql.";"; 
        }

        static private function Cause($cause, $data, $separator)
        {
            $sql = []; 
            foreach ($data as $column => $value) 
            {
                array_push($sql, "`{$column}` = '{$value}'"); 
            }

            return "\n" .$cause . " " . implode($separator ." ", $sql); 
        }
    }

?>