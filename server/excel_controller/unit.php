<?php 
    require_once("../helper/database.php"); 
    use PhpOffice\PhpSpreadsheet\Spreadsheet;
    use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet; 
    use PhpOffice\PhpSpreadsheet\NamedRange; 
    use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
    use PhpOffice\PhpSpreadsheet\Cell\DataValidation; 
    use PhpOffice\PhpSpreadsheet\Style; 


    require_once("get_style.php"); 


    $params = file_get_contents("unit.json"); 
    $params = json_decode($params, true); 

    echo '<pre>'; 
    print_r($params); 
    echo '</pre>'; 

    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    $sheet->setTitle("Data"); 

    $config = file_get_contents("config.json"); 
    $config = json_decode($config, true); 

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

    
    $instruction_titles = $config["instruction_titles"]; 
    $instruction_styles = CellStyles(); 
    InstructionTitles(); 

    
    $col = ord("A"); 
    foreach ($params as $column => $param) 
    {
        $col++; 
        $char = chr($col); 
        $sheet->getColumnDimension($char)->setAutoSize(true); 
        $sheet->setCellValue("{$char}1", $column); 
        $styles = 
        [
            "alignment"=>
            [
                'horizontal' => Style\Alignment::HORIZONTAL_CENTER 
            ], 
            "borders"=> 
            [
                "allBorders"=>
                [
                    'borderStyle' => Style\Border::BORDER_THIN,
                ]
            ]
        ]; 
        foreach ($param as $key => $value) 
        {
            $cell = "{$char}{$instruction_titles[$key]}"; 
            $sheet->setCellValue($cell, $value); 
            $sheet->getStyle($cell)->applyFromArray($styles); 
        }
    }



    $last_char = chr($col); 

    $sheet->duplicateStyle($instruction_styles, "A1:{$last_char}1");

    $merge_styles = MergeStyle(); 
    $merge_range = "B{$instruction_titles['Separate']}:{$last_char}{$instruction_titles['Separate']}"; 
    $sheet->duplicateStyle($merge_styles, $merge_range); 
    $sheet->mergeCells($merge_range); 

    $writer = new Xlsx($spreadsheet);

    $directory = "templates/"; 
    if(!file_exists("{$directory}unit.xlsx"))
    {
        mkdir($directory);    
    }

    $writer->save('templates/unit.xlsx');



?>