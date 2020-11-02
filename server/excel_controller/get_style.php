<?php 
    require_once("../helper/database.php"); 
    use PhpOffice\PhpSpreadsheet\Spreadsheet;
    use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet; 
    use PhpOffice\PhpSpreadsheet\NamedRange; 
    use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
    use PhpOffice\PhpSpreadsheet\Cell\DataValidation; 
    use PhpOffice\PhpSpreadsheet\IOFactory; 


    function CellStyles()
    {
        $file_name = "unit-template.xlsx"; 
        $spreadsheet = IOFactory::load($file_name); 
        $spreadsheet->setActiveSheetIndexByName("Data"); 
        $sheet = $spreadsheet->getActiveSheet(); 
    
        $styles = $sheet->getStyle("A1");
        return $styles; 
    }


    function MergeStyle()
    {
        $file_name = "unit-template.xlsx"; 
        $spreadsheet = IOFactory::load($file_name); 
        $spreadsheet->setActiveSheetIndexByName("Data"); 
        $sheet = $spreadsheet->getActiveSheet(); 

        $styles = $sheet->getStyle("B5"); 
        return $styles; 
    }



    class SampleCellStyles
    {
        private $file_name = "cell-style-samples.xlsx"; 
        private $sheet_name = "Data"; 
        // private $spreadsheet; 
        // private $sheet; 
        private $styles_by_cells; 
        function __construct()
        {
            // $spreadsheet = IOFactory::load($this->file_name); 
            // $spreadsheet->setActiveSheetIndexByName($this->sheet_name); 
            // $this->sheet = $spreadsheet->getActiveSheet(); 
            // $this->spreadsheet = $spreadsheet; 
            // $sheet = $spreadsheet->getActiveSheet();

            $sheet = $this->Sheet(); 
            $column = ord("A"); 

            $this->styles_by_cells = []; 
            $cell_value = $sheet->getCell("A1")->getValue(); 
            while(trim($cell_value))
            {
                $char = chr($column); 
                $this->styles_by_cells[trim($cell_value)] = "{$char}1"; 
                $column++; 
                $char = chr($column); 
                $cell_value = $sheet->getCell("{$char}1")->getFormattedValue(); 
            }
        }

        private function Sheet()
        {
            $spreadsheet = IOFactory::load($this->file_name); 
            $spreadsheet->setActiveSheetIndexByName($this->sheet_name); 
            $sheet = $spreadsheet->getActiveSheet();
            return $sheet; 
        }

        function CellStyles($style_name)
        {
            $sheet = $this->Sheet(); 
            $styles = $sheet->getStyle($this->styles_by_cells[$style_name]); 
            return $styles; 
        }
    }








?>