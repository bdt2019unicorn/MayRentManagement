
<html>
    <head>
        <?php include("layout/head.php") ?>
    </head>
    <body>
        <?php 
            require_once("../server/helper/database.php"); 
            $tables = Connect::GetData("SHOW TABLES"); 
            echo '<pre>'; 
            print_r($tables); 
            echo '</pre>'; 
        ?>

        <footer>
            <?php include("layout/footer.php") ?>
            <script src="js/index.js"></script>
        </footer>
    </body>
    


</html>