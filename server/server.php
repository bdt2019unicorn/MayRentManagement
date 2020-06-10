<?php 
    require_once(realpath(dirname(__DIR__)."\\vendor\\autoload.php")); 
    use Dotenv\Dotenv; 
    $dotenv = Dotenv::createImmutable(dirname(__DIR__)); 
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
            ob_end_clean();
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
                    echo "\n"; 
                    echo $query; 
                    echo"\n"; 
                    $result = $connection->query($query); 
                    if(!$result)
                    {
                        throw new Exception("\n Database error\n"); 
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

        public static function GetId($column, $value, $table,$id_field='id')
        {
            $value = str_replace("'","\'",$value); 
            $sql = "SELECT * FROM `". $table."` WHERE ".$column." = '".$value."'"; 
            $data = Connect::GetData($sql);
            if(is_bool($data))
            {
                return null; 
            }
            if(count($data)>0)
            {
                return $data[0][$id_field]; 
            } 
            else 
            {
                $sql = "INSERT INTO ".$table."(".$column.") VALUES ('".$value."'); ";
                return Connect::GetData($sql, true); 
            }
        }
    }

    $excel = json_decode($_POST['excel']); 

    foreach ($excel as $tenant) 
    {
        $sql = "INSERT INTO `tenant`"; 
        global $columns; 
        global $values; 
        $columns = "("; 
        $values = "VALUES ("; 

        function StringAddition($key, $value)
        {
            global $columns; 
            global $values; 
            $column = str_replace(' ','_',$key);
            $value = str_replace("'","\'",$value); 

            $columns.=$column.',';
            $values.= "'".$value."',";  
        }

        foreach ($tenant as $key => $value) 
        {
            if($key!="Tenant_ID")
            {
                if($key=="Apartment")
                {
                    StringAddition('appartment_id', Connect::GetId('appartment_id',$value, 'tenant')); 
                }
                else 
                {
                    StringAddition($key, $value); 
                }
            }
        }

        
    }

    // $data_result = Connect::GetData("\n insert into `buildings`(name) values ('test J'); \n", true); 
    // print_r($data_result); 

    // $sqls = array
    // (
    //     "insert into `buildings`(name) values ('test 9'); ",
    //     "insert into `buildings`(name1) values ('test 10'); ",
    //     "insert into `buildings`(name) values ('test J'); "
    // ); 
    // $result = Connect::ExecTransaction($sqls); 
    // echo $result; 


//     $str = "Hello world";
// $i = 4;
// echo substr_replace($str, '', $i, 1);







?>
