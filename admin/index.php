
<html>
    <head>
        <?php include("layout/head.php") ?>

    </head>
    <body>
        <?php 
            require_once("../server/helper/database.php"); 
            $tables = Connect::GetData("SHOW TABLES"); 

            $all_tables = []; 
            foreach ($tables as $property) 
            {
                foreach ($property as $table) 
                {
                    array_push($all_tables, $table); 
                }
            }
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
                <li class="nav-item"><a class="nav-link" href="javascript:Logout();">Log out</a></li>
            </ul>
        </nav>

        

        <div class="container-fluid w-100">
            <br>
            <?php if($current_table): ?>
                <?php 
                    $sql = 
                    "
                        SHOW COLUMNS FROM {$current_table};
                        SELECT * FROM `{$current_table}`; 
                    "; 
                    $data = Connect::MultiQuery($sql, true); 

                    $thead = []; 
                    foreach ($data[0] as $column_properties) 
                    {
                        array_push($thead, $column_properties["Field"]); 
                    }
                    $tbody = $data[1]; 

                    function PopulateTableColumnNames($section)
                    {
                        global $thead; 
                        echo "<{$section}>"; 
                        echo "<tr>"; 
                        echo "<td></td>";
                        foreach($thead as $column)
                        {
                            echo "<th>{$column}</th>"; 
                        }
                        echo "</tr>"; 

                        echo "</{$section}>"; 
                    } 
                ?>
                <table id="table-overview" class="display nowrap w-100">
                    <?php PopulateTableColumnNames("thead"); ?>
                    <tbody>
                        <?php foreach ($tbody as $tr): ?>
                            <tr>
                                <td></td>
                                <?php foreach($tr as $value): ?>
                                    <td><?php echo $value; ?></td>
                                <?php endforeach; ?>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                    <?php PopulateTableColumnNames("tfoot"); ?>
                </table>
            <?php endif; ?>

        </div>


        <footer>
            <?php include("layout/footer.php") ?>

            <script src="js/index.js"></script>
            <?php if($current_table): ?>
                <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.22/css/jquery.dataTables.css">
                <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/fixedcolumns/3.3.2/css/fixedColumns.dataTables.min.css">
                <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/select/1.3.1/css/select.dataTables.min.css">
                <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/1.6.4/css/buttons.dataTables.min.css">
                <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.22/js/jquery.dataTables.js"></script>
                <script src="https://cdn.datatables.net/select/1.3.1/js/dataTables.select.min.js"></script>
                <script src="https://cdn.datatables.net/buttons/1.6.4/js/dataTables.buttons.min.js"></script>
                <script>
                    $(document).ready
                    ( 
                        function () 
                        {
                            OverviewTable(); 
                        }
                    );
                </script>
            <?php endif;  ?>
        </footer>
    </body>
</html>