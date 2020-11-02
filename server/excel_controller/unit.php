<?php 
    require_once("../helper/database.php"); 
    use PhpOffice\PhpSpreadsheet\Spreadsheet;
    use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet; 
    use PhpOffice\PhpSpreadsheet\NamedRange; 
    use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
    use PhpOffice\PhpSpreadsheet\Cell\DataValidation; 


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

    $col = ord("A"); 

    $sheet->getColumnDimension("A")->setAutoSize(true); 
    $instruction_styles = 
    [
        "fill"=>
        [
            "startColor"=>
            [
                "argb"=>$config["cell_fill"]["instruction_titles"]["start_color"]
            ], 
            "endColor"=>
            [
                "argb"=>$config["cell_fill"]["end_color"]
            ]
        ]
    ]; 
    foreach ($config["instruction_titles"] as $title => $row) 
    {
        $sheet->setCellValue("A{$row}", $title); 
        $sheet->getStyle("A{$row}")->applyFromArray($instruction_styles); 
    }


    $writer = new Xlsx($spreadsheet);

    $directory = "templates/"; 
    if(!file_exists("{$directory}unit.xlsx"))
    {
        mkdir($directory);    
    }

    $writer->save('templates/unit.xlsx');



?>