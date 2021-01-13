<html>
    <?php include("layout/1.head.php") ?>
    <body>
        <?php include("layout/2.header.php") ?>
        <br>
        <div id="main-forms" class="container-fluid w-100"></div>
        <?php 
            if(!$current_table)
            {
                header("Location: .");
            }

            class AddEditForm
            {
                public $current_table, $test_mode, $form; 
                private $columns, $select_columns; 

                function __construct($current_table, $test_mode, $ids)
                {
                    $this->current_table = $current_table; 
                    $this->test_mode = $test_mode; 
                    $this->ColumnsInformation(); 

                    if($ids)
                    {
                        $form = ""; 
                        $database_records = $this->DatabaseRecords($ids); 
                        foreach ($database_records as $edit_data) 
                        {
                            $form.= $this->CreateForm($edit_data); 
                        }
                        $this->form = $form; 
                    }
                    else 
                    {
                        $this->form = $this->CreateForm(); 
                    }
                }


                private function DatabaseRecords($ids)
                {
                    $ids = base64_decode($ids); 
                    $ids = json_decode($ids); 
                    $id_conditions = join(", ", $ids); 
                    $sql = "SELECT * FROM `{$this->current_table}` WHERE `id` IN ({$id_conditions});";
                    return Database::GetData($sql); 
                }

                private function ColumnsInformation()
                {
                    if($this->test_mode)
                    {
                        $columns = ConnectSqlite::Query("PRAGMA TABLE_INFO('{$this->current_table}');"); 
                        $this->columns = array_map(function($column){return ["Field"=>$column["name"]];}, $columns);
                        $references = ConnectSqlite::Query("PRAGMA FOREIGN_KEY_LIST('{$this->current_table}');"); 
                        $select_columns = []; 
                        foreach ($references as $contraint) 
                        {
                            $select_columns[$contraint["from"]] = 
                            [
                                "value_column" => $contraint["to"], 
                                "options" => Database::GeneralData($contraint["table"]) 
                            ]; 
                        }
                        $this->select_columns = $select_columns; 
                    }
                    else
                    {
                        $sql = 
                        "
                            SET @current_table = '{$this->current_table}'; 
                            SET @show_columns = CONCAT('SHOW COLUMNS FROM ', @current_table);
                            PREPARE all_columns FROM @show_columns; 
                            EXECUTE all_columns; 
                            DEALLOCATE PREPARE all_columns; 
                            SET @db=DATABASE(); 
                            SELECT * FROM `information_schema`.`KEY_COLUMN_USAGE` 
                            WHERE 
                                `CONSTRAINT_SCHEMA` = @db AND
                                `TABLE_NAME` = @current_table AND 
                                `REFERENCED_TABLE_NAME` IS NOT NULL; 
                            SELECT DATABASE(); 
                        "; 
                        $data = Connect::MultiQuery($sql, true); 

                        $this->columns = $data[0]; 
                        $references = $data[1]; 

                        $select_columns = []; 
                        foreach ($references as $contraint) 
                        {
                            $select_columns[$contraint["COLUMN_NAME"]] = 
                            [
                                "value_column" => $contraint["REFERENCED_COLUMN_NAME"], 
                                "options" => Database::GeneralData($contraint["REFERENCED_TABLE_NAME"]) 
                            ]; 
                        }
                        $this->select_columns = $select_columns; 
                    }
                }

                private function CreateForm($edit_data=null)
                {
                    $form = "<form class='container-fluid border border-info py-1' onsubmit='AddEdit(event)'>"; 
                    foreach ($this->columns as $column) 
                    {
                        $field = $column["Field"]; 
                        if($field=="id")
                        {
                            if($edit_data)
                            {
                                $form.=
                                "
                                    <h1>Edit {$this->current_table}</h1>
                                    <h3>ID: {$edit_data['id']}</h3>
                                    <input type='text' hidden name='id' value='{$edit_data['id']}'>
                                "; 
                            }
                            continue; 
                        }
                        $form.=
                        "
                            <div class='form-group row mx-2'>
                                <label for='{$field}'>{$field}</label>
                        "; 
                        if(isset($this->select_columns[$field]))
                        {
                            $GenerateOption = function($value) use ($edit_data, $field)
                            {
                                $option = "<option value='{$value}'"; 
                                if($edit_data)
                                {
                                    if($value=="")
                                    {
                                        return $option; 
                                    }
                                    return ($edit_data[$field]==$value)? $option." selected": $option; 
                                }
                                return ($value=="")? $option." selected": $option; 
                            }; 
                            $input = 
                            "
                                <select class='form-control' name='{$field}'>
                                    {$GenerateOption('')} disabled hidden>&nbsp;</option>
                            "; 
                            $value_column = $this->select_columns[$field]["value_column"]; 
                            $options = $this->select_columns[$field]["options"]; 
                            foreach ($options as $values) 
                            {
                                $value = $values[$value_column]; 
                                $option = $GenerateOption($value); 
                                $value = json_encode($values); 
                                $option.=">{$value}</option>"; 
                                $input.=$option; 
                            }
                            $input.="</select>"; 
                            $form.=$input; 
                        }
                        else 
                        {
                            $input = "<input type='text' class='form-control' name='{$field}'"; 
                            if($edit_data)
                            {
                                $input.=" value='{$edit_data[$field]}'";
                            }
                            $input.=">"; 
                            $form.= $input; 
                        }
                        $form.="</div>"; 
                    }

                    $form.= 
                    "
                            <div class='form-group row text-right'>
                                <div class='col'>
                                    <button type='submit' class='btn btn-success'>Submit</button>
                                </div>
                            </div>
                        </form>
                    "; 

                    return $form; 
                }
            }
            $add_edit_form = new AddEditForm($current_table, $test_mode, $_GET["ids"]??null); 
        ?>
        
        <div class="container-fluid">
            <?php if(!isset($_GET["ids"])): ?>
                <div class="form-group row">
                    <div class="col">
                        <h3>Number of records to be inserted: </h3>
                    </div>
                    <div class="col">
                        <input id="number-of-forms" type="number" min="0" step="1" class="form-control" onchange="NumberOfInsertChanged(this)">
                    </div>
                </div>
            <?php endif; ?>
            <div class="row text-right">
                <div class="col">
                    <button type='button' class='btn btn-success' onclick="AddEditAll()">Submit</button>
                </div>
            </div>
        </div>

        <footer>
            <?php include("layout/3.footer.php") ?>
            <?php include("layout/4.admin.php"); ?>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jQuery.serializeObject/2.0.3/jquery.serializeObject.min.js"></script>
            <script>
                var form = `<?php echo $add_edit_form->form; ?>`; 
                var url_params = new URLSearchParams(window.location.search); 
            </script>
            <script src="js/add-edit.js"></script>
        </footer>
    </body>
</html>