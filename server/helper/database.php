<?php 
    require_once("query.php"); 
    require_once("current_environment.php"); 
    $dotenv = new CurrentEnvironment(); 
    require_once("Database/Connect.php"); 
    require_once("Database/ConnectSqlite.php"); 
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