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








    class Connect
    {
        private static function Connection()
        {
            $servername = "localhost";
            $username = "username";
            $password = "password";
            
            try 
            {
                return new mysqli($servername, $username, $password);
            }
            catch(\Throwable $e)
            {
                // echo $e->getMessage(); 
                return null; 
            }
        }

        public static function GetData($sql)
        {
            $connection = Connect::Connection(); 
            echo $sql; 
        }
    }









?>
