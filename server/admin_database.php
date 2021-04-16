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

        public function TestMode()
        {
            echo CurrentEnvironment::TestMode(); 
        }

        public function CurrentEnvironmentSetUp()
        {
            $values = json_decode($_POST["excel"], true); 
            $test_mode = isset($values[0]["test_mode"]); 
            $current_environment = new CurrentEnvironment(); 
            $current_environment->SettingEnvironment($test_mode); 
            echo true; 
        }

        public function EnvironmentVariableSetUp()
        {
            try 
            {
                $env = json_decode($_POST["excel"], true); 
                CurrentEnvironment::WriteEnv($env[0]); 
                $result = true; 
            }
            catch(Throwable $throwable)
            {
                $result = false; 
            }
            echo $result; 
        }

        public function LogoImg()
        {
            $callback = function ($logo_path)
            {
                if(!file_exists($logo_path))
                {
                    copy(CurrentEnvironment::MainDir() . "/img/logo.png", $logo_path);
                }
            }; 
            $this->LogoImgAction($callback); 
        }

        public function ChangeLogoImg()
        {
            if(isset($_FILES["file"]))
            {
                if(!$_FILES["file"]["error"])
                {
                    $callback = function($logo_path)
                    {
                        imagepng(imagecreatefromstring(file_get_contents($_FILES["file"]["tmp_name"])), "temp/logo.png"); 
                    }; 
                    $this->LogoImgAction($callback); 
                    return;
                }
            }
            echo false;
        }

        private function LogoImgAction($callback)
        {
            CurrentEnvironment::SetupFolder("temp"); 
            $logo_path = "temp/logo.png"; 
            $callback($logo_path); 
            echo "server/{$logo_path}"; 
        }
    }

    $admin_database = new AdminDatabase(); 
    $command = $_GET["command"]; 
    $admin_database->$command(); 
?>