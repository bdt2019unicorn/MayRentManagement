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
            return array_map(fn($id)=>"DELETE FROM {$table} WHERE `{$id_column}` = '{$id}'", $ids); 
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

    require_once(realpath(__DIR__."/../../vendor/autoload.php")); 
    use Dotenv\Dotenv; 
    $dotenv = Dotenv::createImmutable(dirname(dirname(__DIR__))); 
    $dotenv->load(); 

    class Connect
    {
        private static function Connection()
        {
            $servername = $_ENV['SERVERNAME'];
            $username = $_ENV['USERNAME'];
            $password = $_ENV['PASSWORD'];
            $dbname = $_ENV['DBNAME']; 

            $connection = null; 
            
            try 
            {
                $connection = new mysqli($servername, $username, $password,$dbname);
                if ($connection -> connect_errno) 
                {
                    throw new Exception("\nUnable to connect to the database\n"); 
                }
            }
            catch(Throwable $t)
            {
                $connection = null; 
            }
            
            return $connection; 
        }

        public static function GetData($sql, $get_id=false)
        {
            $connection = Connect::Connection(); 
            if($connection==null)
            {
                return null; 
            }

            $data = $connection->query($sql); 
            $result =null; 
            if(is_bool($data))
            {
                if($data&&$get_id)
                {
                    $result = $connection->insert_id; 
                }
                else 
                {
                    $result = $data; 
                }
            }
            try 
            {
                $result = (!$result)?$data->fetch_all(MYSQLI_ASSOC):$result; 
            }
            catch(Throwable $t){}
            $connection->close(); 
            return $result; 
        }

        public static function MultiQuery($sql, $multi_result=false)
        {
            $connection = Connect::Connection(); 
            if($connection==null)
            {
                return null; 
            }
            $array = []; 
            $connection->multi_query($sql); 
            try 
            {
                do 
                {
                    if ($result = $connection->store_result()) 
                    {
                        $data_table = []; 
                        while($result_set = $result->fetch_array(MYSQLI_ASSOC))
                        {
                            if($multi_result)
                            {
                                array_push($data_table, $result_set); 
                            }
                            else 
                            {
                                array_push($array, $result_set); 
                            }
                        }                      
                        if($multi_result)
                        {
                            array_push($array, $data_table); 
                        }
                    }
                } while ($connection->next_result());
            }
            catch(Throwable $t){}
            $connection->close(); 
            return $array; 
        }

        public static function ExecTransaction($sql)
        {
            $connection = Connect::Connection(); 
            if($connection==null)
            {
                return null; 
            }
            $result = false; 
            try 
            {
                $connection->autocommit(false);

                foreach ($sql as $query) 
                {
                    $result = $connection->query($query); 
                    if(!$result)
                    {
                        throw new Exception("\n". var_dump($connection)."\n"); 
                    }
                }
                $connection->commit(); 
                $result = true; 
            }
            catch(Throwable $t)
            {
                echo $t->getMessage(); 
                $connection->rollback(); 
            }

            $connection->close(); 
            return $result; 
        }

        public static function GetId($table, $conditions, $id_field='id')
        {
            $data = Connect::SelectData($table, ["*"], $conditions); 
            if(is_bool($data))
            {
                return null; 
            }
            return (count($data)>0)? $data[0][$id_field]: null; 
        }

        public static function GeneralData($table, $id= null, $id_field='id')
        {
            $sql = Query::GeneralData($table, $id, $id_field); 
            return Connect::GetData($sql); 
        }

        public static function SelectData($table, $selects, $conditions=null)
        {
            $sql = Query::SelectData($table, $selects, $conditions); 
            return Connect::GetData($sql); 
        }
    }
?>