<?php 
    use PhpOffice\PhpSpreadsheet\IOFactory; 

    class SampleCellStyles
    {
        private $file_name = "cell-style-samples.xlsx"; 
        private $sheet_name = "Data"; 
        private $lang; 
        private $styles_by_cells; 
        function __construct($lang)
        {
            $this->lang = $lang; 
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
            $spreadsheet = IOFactory::load("config/$this->lang/$this->file_name"); 
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