<?php 
    require_once(realpath(__DIR__."/../../vendor/autoload.php")); 
    use Dotenv\Dotenv;
    
    class CurrentEnvironment
    {
        function __construct()
        {
            $dotenv = Dotenv::createImmutable(CurrentEnvironment::MainDir()); 
            $dotenv->load(); 
        }

        public static function Setup()
        {
            $dir = CurrentEnvironment::MainDir(); 
            if(!CurrentEnvironment::TestSqliteDatabasePath($dir))
            {
                copy("{$dir}/.env.example", "{$dir}/.env"); 
            } 
            if(!CurrentEnvironment::TestSqliteDatabasePath($dir))
            {
                copy("{$dir}/database.db.example", "{$dir}/database.db"); 
            }
            CurrentEnvironment::TempFolderPath($dir); 
        }

        public static function SetupFolder(...$paths)
        {
            foreach ($paths as $path) 
            {
                if(!file_exists($path))
                {
                    mkdir($path); 
                }
            }
        }

        public static function TempFolderPath($dir=null)
        {
            $dir = $dir?? CurrentEnvironment::MainDir(); 
            $path = "{$dir}/server/temp"; 
            if(!realpath($path))
            {
                CurrentEnvironment::SetupFolder($path); 
            }
            return $path; 
        }

        public static function DotEnvPath($dir=null)
        {
            $dir = $dir?? CurrentEnvironment::MainDir(); 
            return realpath("{$dir}/.env"); 
        }

        public static function TestSqliteDatabasePath($dir=null)
        {
            $dir = $dir?? CurrentEnvironment::MainDir(); 
            return realpath("{$dir}/database.db"); 
        }

        public static function TestMode()
        {
            return $_ENV["TESTMODE"]??false; 
        }

        public static function MainDir()
        {
            return dirname(dirname(__DIR__)); 
        }

        public function SettingEnvironment($value)
        {
            $test_mode = $this->TestMode(); 
            if($test_mode!=$value)
            {
                $env = $_ENV; 
                $env["TESTMODE"] = (int)$value; 
                $this->WriteEnv($env); 
            }
        }

        public static function WriteEnv($env)
        {
            $content = ""; 
            foreach ($_ENV as $key => $value) 
            {
                if(isset($env[$key]))
                {
                    $content.= "{$key} = {$env[$key]}\n"; 
                }
                else 
                {
                    $content.= "{$key} = {$value}\n"; 
                }
            }
            $file = fopen(CurrentEnvironment::DotEnvPath(), "w"); 
            fwrite($file, $content); 
            fclose($file); 
        }

        public function Repo()
        {
            return (object) ["user" => $_ENV["USER"], "repo" => $_ENV["REPO"], "token" => $_ENV["TOKEN"]]; 
        }
    }
?>