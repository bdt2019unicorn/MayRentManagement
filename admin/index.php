<html>
    <?php include("layout/1.head.php") ?>
    <body>
        <?php include("layout/2.header.php") ?>

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
            <?php include("layout/3.footer.php"); ?>
            <?php if($current_table): ?>
                <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.22/css/jquery.dataTables.css">
                <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/fixedcolumns/3.3.2/css/fixedColumns.dataTables.min.css">
                <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/select/1.3.1/css/select.dataTables.min.css">
                <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/1.6.4/css/buttons.dataTables.min.css">
                <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.22/js/jquery.dataTables.js"></script>
                <script src="https://cdn.datatables.net/select/1.3.1/js/dataTables.select.min.js"></script>
                <script src="https://cdn.datatables.net/buttons/1.6.4/js/dataTables.buttons.min.js"></script>
                <script src="js/index.js"></script>
                <script>
                    $(document).ready
                    ( 
                        function () 
                        {
                            OverviewTable(); 
                        }
                    );
                </script>
            <?php endif; ?>
        </footer>
    </body>
</html>