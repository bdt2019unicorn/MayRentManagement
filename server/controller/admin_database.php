<?php 
    require_once("../helper/database.php"); 

    class AdminDatabase
    {
        public function ChangeLogoImg()
        {
            if(isset($_FILES["file"]))
            {
                if(!$_FILES["file"]["error"])
                {
                    $callback = function($logo_path)
                    {
                        imagepng(imagecreatefromstring(file_get_contents($_FILES["file"]["tmp_name"])), $logo_path); 
                    }; 
                    $this->LogoImgAction($callback); 
                    Database::LogUserAction(true, "Change logo", null, file_get_contents($_FILES["file"]["tmp_name"]), null); 
                    return;
                }
            }
            echo false;
        }

        public function CheckEnvironment()
        {
            echo CurrentEnvironment::DotEnvPath()? true: false;
        }

        public function CheckUser()
        {
            $conditions = json_decode($_POST["check_user"], true); 
            $data = Database::SelectData("user", ["*"], $conditions); 
            echo count($data); 
        }

        public function CurrentEnvironmentSetUp()
        {
            $values = json_decode($_POST["excel"], true); 
            $test_mode = isset($values[0]["test_mode"]); 
            $current_environment = new CurrentEnvironment(); 
            $current_environment->SettingEnvironment($test_mode); 
            echo true; 
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
            Database::LogUserAction($result, "Admin Edit All", $_GET["table"], $_POST["edit_all"], implode("\n", $sql)); 
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

        public function RunDbScripts()
        {
            $sql = json_decode($_POST["sql"]); 
            echo Database::ExecTransaction($sql); 
        }
        
        public function TestMode()
        {
            echo CurrentEnvironment::TestMode(); 
        }

        public function UserLogCount()
        {
            $sql = "SELECT COUNT(*) AS 'count' FROM `logs`;"; 
            $data = Database::GetData($sql); 
            $count = intval($data[0]["count"]); 
            $number_of_page = intval($count/$this->log_page_size); 
            echo ($count%$this->log_page_size)? $number_of_page + 1 : $number_of_page; 
        }

        public function UserLogFetch()
        {
            $page = intval($_POST["page"]); 
            $offset = ($page - 1) * $this->log_page_size; 
            $sql = "SELECT * FROM `logs` ORDER BY `modified_time` DESC LIMIT {$this->log_page_size} OFFSET {$offset}"; 
            $data = Database::GetData($sql); 
            echo json_encode($data); 
        }

        private $log_page_size = 10; 
        private function LogoImgAction($callback)
        {
            $temp_path = CurrentEnvironment::TempFolderPath(); 
            $logo_path = "{$temp_path}/logo.png"; 
            $callback($logo_path); 
            echo "server/temp/logo.png"; 
        }
    }

    $admin_database = new AdminDatabase(); 
    $command = $_GET["command"]; 
    $admin_database->$command(); 
?>