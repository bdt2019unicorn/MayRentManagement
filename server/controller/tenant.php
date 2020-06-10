<?php 
    require_once("../helper/connect.php"); 

    $excel = json_decode($_POST['excel']); 
    $queries = []; 

    foreach ($excel as $tenant) 
    {
        $sql = "INSERT INTO `tenant`"; 
        global $columns; 
        global $values; 
        $columns = "("; 
        $values = "VALUES ("; 

        $StringAddition = function($key, $value)
        {
            global $columns; 
            global $values; 
            $key = str_replace(' ','_',$key);
            $key = str_replace("/","_",$key); 
            $key = str_replace("-","",$key); 
            $value = str_replace("'","\'",$value); 

            $columns.=$key.',';
            $values.= "'".$value."',";  
        }; 

        foreach ($tenant as $key => $value) 
        {
            if($key!="Tenant_ID")
            {
                if($key=="Apartment")
                {
                    $StringAddition('apartment_id', Connect::GetId('name',$value, 'apartment')); 
                }
                else 
                {
                    $StringAddition($key, $value); 
                }
            }
        }       
        
        $columns = substr_replace($columns, "",strrpos($columns,","),1) . ")"; 
        $values = substr_replace($values, "",strrpos($values,","),1) . ")";
        $sql.= $columns."\n".$values.";"; 
        array_push($queries,$sql); 
    }

    $result = Connect::ExecTransaction($queries); 
    echo $result; 
?>
