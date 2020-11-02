<?php 
    require_once("../helper/database.php"); 
    use PhpOffice\PhpSpreadsheet\Spreadsheet;
    use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet; 
    use PhpOffice\PhpSpreadsheet\NamedRange; 
    use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
    use PhpOffice\PhpSpreadsheet\Cell\DataValidation; 
    use PhpOffice\PhpSpreadsheet\Style; 


    require_once("SampleCellStyles.php"); 




    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    $sheet->setTitle("Data"); 

    $config = file_get_contents("config.json"); 
    $config = json_decode($config, true); 

    $sample_cell_styles = new SampleCellStyles(); 

    function InstructionTitles()
    {
        global $config; 
        global $sheet; 
        global $instruction_titles; 
        global $instruction_styles; 

        $sheet->getColumnDimension("A")->setAutoSize(true); 
        foreach ($instruction_titles as $title => $row) 
        {
            $sheet->setCellValue("A{$row}", $title); 
        }
        $sheet->duplicateStyle($instruction_styles, "A1:A{$config['total_row']}"); 
    }

    function ColumnHeaders()
    {
        global $spreadsheet; 
        global $sheet; 
        global $col; 
        global $config; 
        global $instruction_titles; 
        global $instruction_styles; 
        global $sample_cell_styles; 

        $params = file_get_contents("params/unit.json"); 
        $params = json_decode($params, true); 

        $format_codes = $config["format_codes"]; 
        $data_row_start = $instruction_titles["Separate"] + 1; 

        foreach ($params["columns"] as $column => $param) 
        {
            $col++; 
            $char = chr($col); 
            $sheet->getColumnDimension($char)->setAutoSize(true); 
            $sheet->setCellValue("{$char}1", $column); 

            $instruction_text_style = $sample_cell_styles->CellStyles("Instruction Text"); 
            foreach ($param as $key => $value) 
            {
                $cell = "{$char}{$instruction_titles[$key]}"; 
                $sheet->setCellValue($cell, $value); 
                $sheet->duplicateStyle($instruction_text_style, $cell); 
            }

            $range_style = $sample_cell_styles->CellStyles($param["Data type"]); 
            $range_style->getNumberFormat()->setFormatCode($format_codes[$param["Data type"]]); 
            $sheet->duplicateStyle($range_style, "{$char}{$data_row_start}:{$char}{$config['total_row']}"); 

            if(isset($params["dropdown_list"][$column]))
            {
                $dropdown = $params["dropdown_list"][$column]; 
                $dropdown_list = Connect::SelectData($dropdown["table"], $dropdown["selects"]); 
                if(count($dropdown_list))
                {
                    $title = null; 
                    $cell_values = []; 
                    foreach ($dropdown_list[0] as $key => $value) 
                    {
                        $title = $key; 
                        array_push($cell_values, $title, $value); 
                        break; 
                    }
                    for ($index=1; $index<count($dropdown_list); $index++) 
                    { 
                        array_push($cell_values, $dropdown_list[$index][$title]); 
                    }

                    $NameRange = function($title, $cell_values) use (&$spreadsheet, $config)
                    {
                        $end_range = count($cell_values); 
                        $dropdown_sheet = new Worksheet($spreadsheet, $title); 
                        $dropdown_sheet->getColumnDimension("A")->setAutoSize(true); 
                        $dropdown_sheet->fromArray(array_chunk($cell_values, 1)); 
                        $spreadsheet->addNamedRange(new NamedRange($title, $dropdown_sheet, "\$A\$2:\$A\${$end_range}")); 
                        $spreadsheet->addSheet($dropdown_sheet); 
                        $dropdown_sheet->getStyle("A1")->applyFromArray($config["dropdown_headings_styles"]); 
                    }; 

                    $NameRange($title, $cell_values); 
                    for ($row=$data_row_start; $row <=$config['total_row']; $row++) 
                    { 
                        $validation = $sheet->getCell("{$char}{$row}")->getDataValidation();
                        $validation->setType(DataValidation::TYPE_LIST); 
                        $validation->setFormula1("={$title}"); 
                        $validation->setShowDropDown(true); 
                    }
                }
            }
        }
    
        $last_char = chr($col); 
    
        $sheet->duplicateStyle($instruction_styles, "A1:{$last_char}1");
    }

    function SeparateInstructionsData()
    {
        global $sheet; 
        global $col; 
        global $instruction_titles; 
        global $sample_cell_styles; 

        $last_char = chr($col); 
        $merge_styles = $sample_cell_styles->CellStyles("Merge"); 
        $merge_range = "B{$instruction_titles['Separate']}:{$last_char}{$instruction_titles['Separate']}"; 
        $sheet->duplicateStyle($merge_styles, $merge_range); 
        $sheet->mergeCells($merge_range); 
    }

    function ExportToFile($spreadsheet)
    {
        $writer = new Xlsx($spreadsheet);

        $directory = "templates/"; 
        if(!file_exists("{$directory}unit.xlsx"))
        {
            mkdir($directory);    
        }
    
        $writer->save('templates/unit.xlsx');
    }
    
    $instruction_titles = $config["instruction_titles"]; 
    $instruction_styles = $sample_cell_styles->CellStyles("Instruction Title"); 
    InstructionTitles(); 

    
    $col = ord("A"); 
    ColumnHeaders(); 
    SeparateInstructionsData(); 
    ExportToFile($spreadsheet); 
?>