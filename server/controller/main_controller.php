<?php 
	require_once("../helper/connect.php"); 
	function ExecExcelCommand($table, $date_collumns, $exclude_columns, $get_id, $year_number, $comma=[])
	{
	    $excel = json_decode($_POST['excel']); 
	    $queries = []; 

	    foreach ($excel as $row) 
	    {
	        $sql = "INSERT INTO `".$table."`"; 
	        global $columns; 
	        global $values; 
	        $columns = "("; 
	        $values = "VALUES ("; 

	        $StringAddition = function($key, $value)
	        {
	            global $columns; 
	            global $values; 
	            global $date_collumns; 
	            global $year_number; 
	            global $comma; 
	            $key = trim($key); 
	            $key = str_replace(' ','_',$key);
	            $key = str_replace("/","_",$key); 
	            $key = str_replace("-","",$key); 
	            $value = trim($value); 
	            $value = str_replace("'","\'",$value); 

	            $columns.=$key.',';
	            if(in_array(strtolower($key), $date_collumns))
	            {
	            	$value = "STR_TO_DATE('".substr_replace($value,"/".$year_number,strrpos($value,"/"),1)."','%m/%d/%Y')"; 
	            }
	            else if(in_array($key, $comma))
	            {
	            	$value = "'".str_replace(",", '', $value)."'"; 
	            }
	            else 
	            {
	            	$value = "'".$value."'"; 
	            }
	            $values.= $value.",";  
	        }; 

	        foreach ($row as $key => $value) 
	        {
	            if(!in_array($key,$exclude_columns))
	            {
	                if(isset($get_id[$key]))
	                {
	                    $StringAddition($get_id[$key]['change'], Connect::GetId($get_id[$key]['search'],$value,$get_id[$key]['table'])); 
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
	}
?>