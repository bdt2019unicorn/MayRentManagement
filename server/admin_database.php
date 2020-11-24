<?php 
    require_once("./helper/database.php"); 

    class AdminDatabase
    {
        public function CheckUser()
        {
            $conditions = json_decode($_POST["check_user"], true); 
            $data = Connect::SelectData("user", ["*"], $conditions); 
            echo count($data); 
        }

        public function Login()
        {
            $data = Connect::SelectData("user", ["*"], $_POST); 
            if(count($data)==1)
            {
                echo json_encode($data[0]); 
            }
            else 
            {
                echo false; 
            }
        }

        public function EditAll()
        {
            $edit_data = json_decode($_POST["edit_all"], true); 
            $sql = []; 
            foreach ($edit_data as $id => $data) 
            {
                array_push($sql, Query::Update($_GET["table"], $data, ["id"=>$id])); 
            }

            $result = Connect::ExecTransaction($sql); 
            echo $result; 
        }
    }

    $admin_database = new AdminDatabase(); 
    $command = $_GET["command"]; 
    $admin_database->$command(); 
?>