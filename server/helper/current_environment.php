<?php 
    require_once(realpath(__DIR__."/../../vendor/autoload.php")); 
    use Dotenv\Dotenv;
    
    class CurrentEnvironment
    {
        function __construct()
        {
            $dotenv = Dotenv::createImmutable(CurrentEnvironment::DotEnvDir()); 
            $dotenv->load(); 
        }

        public static function Setup()
        {
            $dotenv = CurrentEnvironment::DotEnvPath(); 
            $test_sqlite = CurrentEnvironment::TestSqliteDatabasePath(); 
            $dir = CurrentEnvironment::DotEnvDir(); 
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
            $dir = CurrentEnvironment::DotEnvDir(); 
            return realpath("{$dir}/.env"); 
        }

        public static function TestSqliteDatabasePath()
        {
            $dir = CurrentEnvironment::DotEnvDir(); 
            return realpath("{$dir}/database.db"); 
        }

        public static function TestMode()
        {
            return $_ENV["TESTMODE"]??false; 
        }

        private static function DotEnvDir()
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
    }
?>