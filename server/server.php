<?php 
    $excel = json_decode($_POST['excel']); 

    foreach ($excel as $tenant) 
    {
        $sql = "INSERT INTO `tenant`"; 
        $columns = "("; 
        $values = "VALUES ("; 
        foreach ($tenant as $key => $value) 
        {
            if($key!="Tenant_ID")
            {
                if($key=="Apartment")
                {
                    $columns.='appartment_id,'; 
                }
            }
        }

        
    }

    Connect::GetData("\nI am testing my connection and I think it may fail\n"); 

    require_once(realpath(dirname(__DIR__)."\\vendor\\autoload.php")); 
    use Dotenv\Dotenv; 
    $dotenv = Dotenv::createImmutable(dirname(__DIR__)); 
    $dotenv->load(); 






    // require_once realpath(__DIR__.)
    class Connect
    {
        private static function Connection()
        {
            $servername = $_ENV['SERVERNAME'];
            $username = $_ENV['USERNAME'];
            $password = $_ENV['PASSWORD'];
            
            try 
            {
                $connection = new mysqli($servername, $username, $password);
                if ($connection -> connect_errno) 
                {
                    throw new Exception("\nUnable to connect to the database\n"); 
                }
                return $connection;  
            }
            catch(Throwable $e)
            {
                return null;
            }
        }

        public static function GetData($sql)
        {
            $connection = Connect::Connection(); 
            ob_end_clean();
            if($connection==null)
            {
                return null; 
            }
            else 
            {
                echo "\n It is really bad \n"; 

                $connection->close(); 
                // mysqli_close($connection); 
                return null; 
            }
        }


        public static function GetId($column, $value, $table)
        {
            
            // $sql = "SELECT * FROM `". $table."` WHERE ".$column." = 
            // $data = Connect::GetData(); 
        }
    }









?>
