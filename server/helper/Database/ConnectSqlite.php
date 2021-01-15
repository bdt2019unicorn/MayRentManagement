<?php 
    class ConnectSqlite
    {
        private static function Connection()
        {
            $path = CurrentEnvironment::TestSqliteDatabasePath(); 
            $connection = new PDO("sqlite:{$path}"); 
            $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $connection; 
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
                echo $throwable->getMessage(); 
                return false; 
            }
        }

        public static function Exec($sql, $get_id = false)
        {
            $connection = ConnectSqlite::Connection(); 
            try 
            {
                $result = $connection->exec($sql); 
                return $get_id?$connection->lastInsertId(): $result; 
            }
            catch(Throwable $throwable)
            {
                echo $throwable->getMessage(); 
                return false; 
            }
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

        public static function InsertFile($table, $data, $file_path, $file_key = "file")
        {
            $sql = "INSERT INTO `{$table}`"; 
            $columns = "("; 
            $values = "VALUES ("; 
            $params = []; 
            foreach ($data as $column => $value) 
            {
                if($column!=$file_key)
                {
                    $param = ":{$column}"; 
                    $params[$param] = $value; 
                    $columns.= "`{$column}`, "; 
                    $values.= "{$param},"; 
                }
            }

            $columns.= "`{$file_key}`) "; 
            $values.= ":{$file_key}); "; 
            $sql.= $columns.$values; 

            return ConnectSqlite::FileDatabaseExecute($sql, $params, $file_path, $file_key); 
        }

        public static function EditFile($table, $data, $conditions, $file_path, $file_key = "file")
        {
            $sql = "UPDATE `{$table}` SET "; 
            $params = []; 
            foreach ($data as $column => $value) 
            {
                if($column!=$file_key)
                {
                    $param = ":{$column}"; 
                    $params[$param] = $value; 
                    $sql.= "`{$column}` = {$param}, "; 
                }
            }
            
            $where = []; 
            foreach ($conditions as $column => $value) 
            {
                $param = ":{$column}"; 
                $params[$param] = $value; 
                array_push($where, "`{$column}`={$param}"); 
            }

            $sql.="`{$file_key}` = :{$file_key} WHERE ". implode(" AND ", $where);
            return ConnectSqlite::FileDatabaseExecute($sql, $params, $file_path, $file_key); 
        }

        private static function FileDatabaseExecute($sql, $params, $file_path, $file_key = "file")
        {
            $file = fopen($file_path, "rb"); 
    
            $connection = ConnectSqlite::Connection();  
        
            $statement = $connection->prepare($sql);
            foreach ($params as $key => $value) 
            {
                $statement->bindValue($key, $value); 
            }
        
            $statement->bindValue(":{$file_key}", $file, PDO::PARAM_LOB);
            $result = $statement->execute();
        
            fclose($file); 
            return $result; 
        }
    }
?>