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

        static public function CaseWhen($condition, $true, $false)
        {
            return 
            "
                CASE 
                    WHEN {$condition} THEN {$true}
                    ELSE {$false}
                END
            "; 
        }

        static public function CaseWhens($conditions, $false)
        {
            $main = ""; 
            foreach ($conditions as $condition => $true) 
            {
                if(count($conditions)==1)
                {
                    return Query::CaseWhen($condition, $true, $false); 
                }
                $main.= "\nWHEN {$condition} THEN {$true}\n"; 
            }
            return 
            "
                CASE 
                    $main
                    ELSE {$false}
                END
            "; 
        }
        
        static public function IfNull($expression, $false)
        {
            return 
            "
                IFNULL
                (
                    (
                        {$expression}
                    ), 
                    (
                        {$false}
                    )
                ) 
            "; 
        }

        static public function CastAsChar($clause, $test_mode=false)
        {
            $char = $test_mode? "TEXT": "CHAR"; 
            return "CAST({$clause} AS {$char})"; 
        }

        static public function NumberFormat($expression, $test_mode=false)
        {
            $format = $test_mode? "ROUND" : "FORMAT";  
            return 
            "
                (
                    {$format}({$expression}, 0)
                )
            "; 
        }
        
        static public function Concat($pieces, $test_mode=false)
        {
            $glue = $test_mode? "||\n": ",\n"; 
            $concat = "(\n" . implode($glue, $pieces) . "\n)"; 
            return $test_mode? $concat: "CONCAT\n{$concat}"; 
        }

        static public function DateFormatStandard($clause, $test_mode=false)
        {
            return $test_mode? "STRFTIME('%d/%m/%Y', {$clause})" : "DATE_FORMAT({$clause},'%d/%m/%Y')"; 
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