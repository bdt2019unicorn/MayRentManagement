<header>
    <?php 
        require_once("../server/helper/database.php"); 

        $current_environment = new CurrentEnvironment(); 
        $test_mode = $current_environment->TestMode(); 

        function AllTablesProduction()
        {
            $tables = Connect::GetData("SHOW TABLES"); 

            $all_tables = []; 
            foreach ($tables as $property) 
            {
                foreach ($property as $table) 
                {
                    array_push($all_tables, $table); 
                }
            }
            return $all_tables; 
        }

        function AllTablesTest()
        {
            $sql = "SELECT * FROM `sqlite_master` WHERE `type`='table' AND `name`<>'sqlite_sequence'"; 
            $tables = ConnectSqlite::Query($sql); 
            return array_map(function($table){return $table["name"];}, $tables); 
        }

        $all_tables = $test_mode?AllTablesTest(): AllTablesProduction(); 
        $current_table = $_GET["table"]??null; 
    ?>

    <nav class="navbar navbar-expand-lg navbar-dark bg-dark justify-content-between">
        <a class="navbar-brand" href=".">Admin</a>

        <div class="dropdown navbar-nav w-50">
            <a class="btn btn-info dropdown-toggle w-100" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <?php echo($current_table?$current_table: "Choose a table"); ?>
            </a>

            <div class="dropdown-menu w-100" aria-labelledby="dropdownMenuLink">
                <a class="dropdown-item" href=".">&nbsp;</a>
                <?php foreach ($all_tables as $table): ?> 
                    <a class="dropdown-item" href=".?table=<?php echo $table;?>"><?php echo $table; ?></a>
                <?php endforeach; ?>
            </div>
        </div>
        <ul class="navbar-nav">
            <li class="nav-item"><a class="nav-link" href="javascript:Logout(true);">Log out</a></li>
        </ul>
    </nav>
</header>