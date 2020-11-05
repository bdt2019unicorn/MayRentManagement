<?php 

    if(file_exists("templates"))
    {
        array_map("unlink", glob("templates/*.*")); 
        rmdir("templates"); 
    }



?>