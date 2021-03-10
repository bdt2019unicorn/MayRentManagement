<?php 
	
	$file_path = "logo (1).gif"; 
	imagepng(imagecreatefromstring(file_get_contents($file_path)), "temp/output1.png"); 

?>