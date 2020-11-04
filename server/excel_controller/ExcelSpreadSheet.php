<?php     
    require_once("../helper/database.php"); 
    use PhpOffice\PhpSpreadsheet\Spreadsheet;
    use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet; 
    use PhpOffice\PhpSpreadsheet\NamedRange; 
    use PhpOffice\PhpSpreadsheet\Cell\DataValidation; 

    require_once("SampleCellStyles.php"); 

    class ExcelSpreadSheet
    {
        public $spreadsheet; 
        private $config; 
        private $sample_cell_styles; 
        private $instruction_titles; 
        private $instruction_styles; 
        
        private $sheet_title = "Data"; 
        private $sheet; 

        private $params; 
        private $building_id; 

        private $column_asc; 

        function __construct($controller, $building_id=null)
        {
            $this->spreadsheet = new Spreadsheet();
            $this->sheet = $this->spreadsheet->getActiveSheet();
            $this->sheet->setTitle($this->sheet_title); 
        
            $config = file_get_contents("config.json"); 
            $this->config = json_decode($config, true); 
        
            $this->sample_cell_styles = new SampleCellStyles(); 
            $this->instruction_titles = $this->config["instruction_titles"]; 
            $this->instruction_styles = $this->sample_cell_styles->CellStyles("Instruction Title"); 

            $params = file_get_contents("params/{$controller}.json"); 
            $this->params = json_decode($params, true); 
            $this->building_id = $building_id; 

            $this->column_asc = ord("A"); 
        }

        function GenerateSpreadsheet()
        {
            $this->InstructionTitles(); 
            $this->ColumnHeaders(); 
            $this->SeparateInstructionsData(); 
            return $this->spreadsheet; 
        }

        private function InstructionTitles()
        {
            $this->sheet->getColumnDimension("A")->setAutoSize(true); 
            foreach ($this->instruction_titles as $title => $row) 
            {
                $this->sheet->setCellValue("A{$row}", $title); 
            }
            $this->sheet->duplicateStyle($this->instruction_styles, "A1:A{$this->config['total_row']}"); 
        }
        
        private function ColumnHeaders()
        {
            $format_codes = $this->config["format_codes"]; 
            $data_row_start = $this->instruction_titles["Separate"] + 1; 
            foreach ($this->params["columns"] as $column => $param) 
            {
                $this->column_asc++; 
                $char = chr($this->column_asc); 
                $this->sheet->getColumnDimension($char)->setAutoSize(true); 
                $this->sheet->setCellValue("{$char}1", $column); 

                $instruction_text_style = $this->sample_cell_styles->CellStyles("Instruction Text"); 
                foreach ($param as $key => $value) 
                {
                    $cell = "{$char}{$this->instruction_titles[$key]}"; 
                    $this->sheet->setCellValue($cell, $value); 
                    $this->sheet->duplicateStyle($instruction_text_style, $cell); 
                }

                $range_style = $this->sample_cell_styles->CellStyles($param["Data type"]); 
                $range_style->getNumberFormat()->setFormatCode($format_codes[$param["Data type"]]); 
                $this->sheet->duplicateStyle($range_style, "{$char}{$data_row_start}:{$char}{$this->config['total_row']}"); 

                if(isset($this->params["dropdown_list"][$column]))
                {
                    $this->DropdownList($this->params["dropdown_list"][$column], $data_row_start, $char); 
                }
            }
            $last_char = chr($this->column_asc); 
            $this->sheet->duplicateStyle($this->instruction_styles, "A1:{$last_char}1");
        }
        
        private function DropdownList($dropdown, $data_row_start, $char)
        {
            $conditions = null; 
            if(!$this->building_id)
            {
                goto DropdownWorkSection; 
            }
            if(isset($dropdown["building_id"]))
            {
                $conditions = ["building_id"=>$this->building_id]; 
            }

            DropdownWorkSection: 
            $dropdown_list = Connect::SelectData($dropdown["table"], $dropdown["selects"], $conditions); 
            if(!count($dropdown_list))
            {
                return; 
            }

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

            $end_range = count($cell_values); 
            $dropdown_sheet = new Worksheet($this->spreadsheet, $title); 
            $dropdown_sheet->getColumnDimension("A")->setAutoSize(true); 
            $dropdown_sheet->fromArray(array_chunk($cell_values, 1)); 
            $name_range_title = str_replace(" ", "", $title); 
            $this->spreadsheet->addNamedRange(new NamedRange($name_range_title, $dropdown_sheet, "\$A\$2:\$A\${$end_range}")); 
            $this->spreadsheet->addSheet($dropdown_sheet); 
            $dropdown_sheet->getStyle("A1")->applyFromArray($this->config["dropdown_headings_styles"]); 

            for ($row=$data_row_start; $row <=$this->config['total_row']; $row++) 
            { 
                $validation = $this->sheet->getCell("{$char}{$row}")->getDataValidation();
                $validation->setType(DataValidation::TYPE_LIST); 
                $validation->setFormula1("={$name_range_title}"); 
                $validation->setShowDropDown(true); 
            }
        }

        private function SeparateInstructionsData()
        {
            $last_char = chr($this->column_asc); 
            $merge_styles = $this->sample_cell_styles->CellStyles("Merge"); 
            $merge_range = "B{$this->instruction_titles['Separate']}:{$last_char}{$this->instruction_titles['Separate']}"; 
            $this->sheet->duplicateStyle($merge_styles, $merge_range); 
            $this->sheet->mergeCells($merge_range); 
        }
    }
?>