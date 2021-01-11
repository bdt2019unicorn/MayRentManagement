<?php 
    require_once("query.php"); 
    require_once("current_environment.php"); 
    $dotenv = new CurrentEnvironment(); 

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
                } while ($connection->more_results() && $connection->next_result());
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
                    $exec = $connection->query($query); 
                    if(!$exec)
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
    }
    
    class ConnectSqlite
    {
        private static function Connection()
        {
            $path = CurrentEnvironment::TestSqliteDatabasePath(); 
            return new PDO("sqlite:{$path}"); 
        }

        public static function Query($sql)
        {
            $connection = ConnectSqlite::Connection(); 
            try 
            {
                $statement = $connection->query($sql); 
                $rows = $statement->fetchAll(PDO::FETCH_ASSOC); 
                return $rows; 
            }
            catch(Throwable $throwable)
            {
                return false; 
            }
        }

        public static function Exec($sql, $get_id = false)
        {
            $connection = ConnectSqlite::Connection(); 
            $result = $connection->exec($sql); 
            return $get_id?$connection->lastInsertId(): $result; 
        }

        public static function ExecTransaction($sql)
        {
            $connection = ConnectSqlite::Connection(); 
            $result = false; 
            try 
            {
                $connection->beginTransaction();

                foreach ($sql as $query) 
                {
                    $exec = $connection->query($query); 
                    if(!$exec)
                    {
                        throw new Exception("\n". var_dump($connection)."\n"); 
                    }
                }
                
                $connection->commit(); 
                $result = true; 
            }
            catch (Throwable $throwable)
            {
                echo $throwable->getMessage(); 
                $connection->rollBack(); 
            }   
            return $result; 
        }
    }
    
    class Database
    {
        public static function GetData($sql)
        {
            $test_mode = CurrentEnvironment::TestMode(); 
            return $test_mode?ConnectSqlite::Query($sql): Connect::GetData($sql); 
        }

        public static function ExecTransaction($sql)
        {
            $test_mode = CurrentEnvironment::TestMode(); 
            return $test_mode?ConnectSqlite::ExecTransaction($sql): Connect::ExecTransaction($sql); 
        }

        public static function GetId($table, $conditions, $id_field='id')
        {
            $data = Database::SelectData($table, ["*"], $conditions); 
            if(is_bool($data))
            {
                return null; 
            }
            return (count($data)>0)? $data[0][$id_field]: null; 
        }

        public static function GeneralData($table, $id= null, $id_field='id')
        {
            $sql = Query::GeneralData($table, $id, $id_field); 
            return Database::GetData($sql); 
        }

        public static function SelectData($table, $selects, $conditions=null)
        {
            $sql = Query::SelectData($table, $selects, $conditions); 
            return Database::GetData($sql); 
        }
    }
?>