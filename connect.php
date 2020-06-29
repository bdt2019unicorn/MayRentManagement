<?php 
	
	$connection = new mysqli("localhost", "root", "", "may");

	echo "<pre>";
	print_r($connection); 
	echo "</pre>";

	$data = $connection->query("select * from `tenant`"); 


	echo "<h1>I am ready</h1>";

	echo "<pre>";
	print_r($data); 
	echo "</pre>";

?>