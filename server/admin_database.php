<?php 
    require_once("./helper/database.php"); 

    class AdminDatabase
    {
        public function CheckUser()
        {
            $conditions = json_decode($_POST["check_user"], true); 
            $data = Database::SelectData("user", ["*"], $conditions); 
            echo count($data); 
        }

        public function Login()
        {
            $data = Database::SelectData("user", ["*"], $_POST); 
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

        public function CheckEnvironment()
        {
            echo CurrentEnvironment::DotEnvPath()? true: false;
        }

        public function ProductionEnvironmentSetUp()
        {
            try 
            {
                CurrentEnvironment::WriteEnv($_POST); 
                $result = true; 
            }
            catch(Throwable $throwable)
            {
                $result = false; 
            }
            $this->BackToDatabaseSetup($result, "Production Database Set Up completed!"); 
        }

        public function CreateAdmin()
        {
            $sql = Query::Insert("user", $_POST); 
            $test_mode = CurrentEnvironment::TestMode(); 
            $result = $test_mode?ConnectSqlite::Exec($sql): Connect::GetData($sql); 
            $this->BackToDatabaseSetup($result, 'Admin Created!'); 
        }

        private function BackToDatabaseSetup($result, $success_message) 
        {
            $script = "<script>"; 
            if($result)
            {
                $script.= "\nalert('{$success_message}'); \n"; 
            }
            $script.= "window.location.href = '../admin/setup.php'; \n </script>";
            echo $script; 
        }
    }

    $admin_database = new AdminDatabase(); 
    $command = $_GET["command"]; 
    $admin_database->$command(); 
?>