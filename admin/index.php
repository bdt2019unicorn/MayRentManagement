<html>
    <?php include("layout/1.head.php") ?>
    <body>
        <?php include("layout/2.header.php") ?>

        <div class="container-fluid w-100">
            <br>
            <?php if($current_table): ?>
                <?php 
                    class TableObject
                    {
                        public $thead, $tbody, $current_table; 
                        function __construct($current_table, $test_mode)
                        {
                            $this->current_table = $current_table; 
                            if($test_mode)
                            {
                                $this->PopulateTheadTbodyTest(); 
                            }
                            else 
                            {
                                $this->PopulateTheadTbodyProduction(); 
                            }
                        }

                        public function PopulateTableColumnNames($section)
                        {
                            echo "<{$section}>"; 
                            echo "<tr>"; 
                            echo "<td></td>";
                            array_walk($this->thead, function($column){echo "<th>{$column}</th>"; }); 
                            echo "</tr>"; 
                            echo "</{$section}>"; 
                        } 

                        private function PopulateTheadTbodyProduction()
                        {
                            $sql = 
                            "
                                SHOW COLUMNS FROM {$this->current_table};
                                SELECT * FROM `{$this->current_table}`; 
                            "; 
                            $data = Connect::MultiQuery($sql, true); 
        
                            $thead = []; 
                            foreach ($data[0] as $column_properties) 
                            {
                                array_push($thead, $column_properties["Field"]); 
                            }
                            $this->thead = array_map($this->TheadMapFunction("Field"), $data[0]); 
                            $this->tbody = $data[1]; 
                        }

                        private function PopulateTheadTbodyTest()
                        {
                            $columns = ConnectSqlite::Query("PRAGMA TABLE_INFO('{$this->current_table}')"); 
                            $this->thead = array_map($this->TheadMapFunction("name"), $columns); 
                            $this->tbody = ConnectSqlite::Query("SELECT * FROM `{$this->current_table}`"); 
                        }

                        private function TheadMapFunction($column_name)
                        {
                            return function($column) use ($column_name) {return $column[$column_name];}; 
                        }

                    }
                    $table_object = new TableObject($current_table, $test_mode); 
                ?>
                <table id="table-overview" class="display nowrap w-100">
                    <?php $table_object->PopulateTableColumnNames("thead"); ?>
                    <tbody>
                        <?php foreach ($table_object->tbody as $tr): ?>
                            <tr>
                                <td></td>
                                <?php foreach($tr as $column=>$value): ?>
                                    <td>
                                        <?php 
                                            if($table_object->current_table=="documents" && $column=="file")
                                            {
                                                $href = "data:application/octet-stream;base64," . base64_encode($value); 
                                                echo "<a href='{$href}' download='file.{$tr['file_extension']}'>File</a>"; 
                                            }
                                            else 
                                            {
                                                echo $value; 
                                            }
                                        ?>
                                    </td>
                                <?php endforeach; ?>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                    <?php $table_object->PopulateTableColumnNames("tfoot"); ?>
                </table>
            <?php else: ?>
                <?php 
                    $users = Database::SelectData("user", ["*"]); 
                    $unapproved_users = array_filter($users, function($user){return $user["approved"]=="0"; }); 
                ?>
                <?php if(count($unapproved_users)): ?>
                    <h1 class="text-center m-3">Users need attention</h1>
                    <?php foreach ($unapproved_users as $user): ?>
                        <div class="row m-2 border border-info">
                            <div class="col">
                                <h4><?php echo $user["username"]; ?></h4>
                                <p><b>Phone Number: </b><?php echo $user["phone_number"]; ?></p>
                                <p><b>Email Address: </b><?php echo $user["email"]; ?></p>
                                <p><b>Viber Number: </b><?php echo $user["viber_number"]; ?></p>
                            </div>
                            <div class="col-1 text-right">
                                <button class="btn btn-success" title="Approve <?php echo $user['username']; ?>" onclick="UserApprove('<?php echo $user['id']; ?>')"><i class="fas fa-check"></i></button>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>

                <div class="border border-info p-3 m-3 text-center">
                    <h1>Current Logo</h1>
                    <img id="logo_img" alt="logo" class="border border-secondary p-3" />
                    <p><button class="btn btn-info m-3" type="button" onclick="ChangeLogo()">Change Logo</button></p>
                </div>

                <div class="border border-info p-3 m-3 text-center">
                    <h1>Run Database Scripts</h1>
                    <textarea id="db_scripts_textarea" class="w-100" rows="10" placeholder="Enter scripts here"></textarea>
                    <dd>Separate each scripts with a semicolon (;)</dd>
                    <p><button class="btn btn-info m-3" type="button" onclick="RunDbScripts()" title="Run Scripts"><i class="fas fa-arrow-right"></i></button></p>
                </div>

            <?php endif; ?>
        </div>

        <footer>
            <?php include("layout/3.footer.php"); ?>
            <?php include("layout/4.admin.php"); ?>
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
            <?php else: ?>
                <script type="text/javascript">
                    $(document).ready 
                    (
                        function()
                        {
                            var logo_src = support_mixin.methods.AjaxRequest("../server/controller/admin_database.php?command=LogoImg"); 
                            document.getElementById('logo_img').src = `../${logo_src}`; 
                        }
                    ); 
                </script>
            <?php endif; ?>
        </footer>
    </body>
</html>