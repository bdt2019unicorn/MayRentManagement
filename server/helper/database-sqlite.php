<?php 
    require_once("database.php"); 
    class ConnectSqlite
    {
        private static function Connection()
        {
            $path = realpath("../database.db"); 
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

        public static function GetId($table, $conditions, $id_field='id')
        {
            $data = ConnectSqlite::SelectData($table, ["*"], $conditions); 
            if(is_bool($data))
            {
                return null; 
            }
            return (count($data)>0)? $data[0][$id_field]: null; 
        }

        public static function GeneralData($table, $id= null, $id_field='id')
        {
            $sql = Query::GeneralData($table, $id, $id_field); 
            return ConnectSqlite::Query($sql); 
        }

        public static function SelectData($table, $selects, $conditions=null)
        {
            $sql = Query::SelectData($table, $selects, $conditions); 
            return ConnectSqlite::Query($sql); 
        }
    }

?>