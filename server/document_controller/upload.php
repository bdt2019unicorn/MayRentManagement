<?php 
    if(!file_exists("temp"))
    {
        mkdir("temp"); 
    }

    echo "<pre>"; print_r($_POST); print_r($_FILES); echo '</pre>'; 

?>