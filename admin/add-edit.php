<html>
    <?php include("layout/1.head.php") ?>
    <body>
        <?php include("layout/2.header.php") ?>
        <br>
        <div id="main-forms" class="container-fluid w-100">
            <?php if($current_table): ?>
                <?php 
                    function CreateForm($edit_data=null)
                    {
                        global $columns, $select_columns, $current_table; 
                        $form = "<form class='container-fluid border border-info py-1' onsubmit='AddEdit(event)'>"; 
                        foreach ($columns as $column) 
                        {
                            $field = $column["Field"]; 
                            if($field=="id")
                            {
                                if($edit_data)
                                {
                                    $form.=
                                    "
                                        <h1>Edit {$current_table}</h1>
                                        <h3>ID: {$edit_data['id']}</h3>
                                    "; 
                                }
                                continue; 
                            }
                            $form.=
                            "
                                <div class='form-group row mx-2'>
                                    <label for='{$field}'>{$field}</label>
                            "; 
                            if(isset($select_columns[$field]))
                            {
                                $GenerateOption = function($value) use ($edit_data, $field)
                                {
                                    $option = "<option value='{$value}'"; 
                                    if($edit_data)
                                    {
                                        $option.=($edit_data[$field]==$value)?" selected": ""; 
                                    }
                                    return $option; 
                                }; 
                                $input = 
                                "
                                    <select class='form-control' name='{$field}'>
                                        {$GenerateOption('')} selected disabled hidden>&nbsp;</option>
                                "; 
                                $value_column = $select_columns[$field]["value_column"]; 
                                $options = $select_columns[$field]["options"]; 
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

                    $sql = 
                    "
                        SET @current_table = '{$current_table}'; 
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

                    $columns = $data[0]; 
                    $references = $data[1]; 

                    $select_columns = []; 
                    foreach ($references as $contraint) 
                    {
                        $select_columns[$contraint["COLUMN_NAME"]] = 
                        [
                            "value_column" => $contraint["REFERENCED_COLUMN_NAME"], 
                            "options" => Connect::GeneralData($contraint["REFERENCED_TABLE_NAME"]) 
                        ]; 
                    }

                    $form = CreateForm(); 
                ?>

            <?php else: ?>
                <?php header("Location: ."); ?>
            <?php endif; ?>
        </div>
        
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
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jQuery.serializeObject/2.0.3/jquery.serializeObject.min.js"></script>
            <script>
                var form = `<?php echo $form; ?>`; 
                var url_params = new URLSearchParams(window.location.search); 
            </script>
            <script src="js/add-edit.js"></script>
        </footer>
    </body>
</html>