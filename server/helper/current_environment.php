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

        public static function DotEnvPath()
        {
            $dir = CurrentEnvironment::DotEnvDir(); 
            return realpath("{$dir}/.env"); 
        }

        public static function TestMode()
        {
            return $_ENV["TESTMODE"]??false; 
        }

        private static function DotEnvDir()
        {
            return dirname(dirname(__DIR__)); 
        }
    }
?>