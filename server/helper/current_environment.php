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
            $dotenv = CurrentEnvironment::DotEnvPath(); 
            $test_sqlite = CurrentEnvironment::TestSqliteDatabasePath(); 
            $dir = CurrentEnvironment::MainDir(); 
            if(!$dotenv)
            {
                copy("{$dir}/.env.example", "{$dir}/.env"); 
            } 
            if(!$test_sqlite)
            {
                copy("{$dir}/database.db.example", "{$dir}/database.db"); 
            }
        }

        public static function DotEnvPath()
        {
            $dir = CurrentEnvironment::MainDir(); 
            return realpath("{$dir}/.env"); 
        }

        public static function TestSqliteDatabasePath()
        {
            $dir = CurrentEnvironment::MainDir(); 
            return realpath("{$dir}/database.db"); 
        }

        public static function TestMode()
        {
            return $_ENV["TESTMODE"]??false; 
        }

        private static function MainDir()
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
            foreach ($env as $key => $value) 
            {
                $content.= "{$key} = {$value}\n"; 
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