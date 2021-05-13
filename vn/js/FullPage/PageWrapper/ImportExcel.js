class ImportExcel extends PageWrapperChildrenComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.state = 
        {
            file_input: true, 
            table: [], 
            translation: ServerJson(`../server/json/translation/ImportExcel/${this.CurrentController()}.json`)
        }; 
    }
    Methods = 
    { 
        ActionButtonClick()
        {
            let translation_keys = Object.keys(this.state.translation); 
            let table_columns = Object.keys(this.state.table[0]); 
            let columns_not_belong = table_columns.filter(column=>!translation_keys.includes(column)); 
            if(columns_not_belong.length)
            {
                alert("Bạn đã nhập dữ liệu ở sai bảng. Vui lòng chọn mục khác"); 
                return;
            }
            let data = this.state.table.map
            (
                row => translation_keys.reduce
                (
                    (accumulator, current_value) => 
                    (
                        {
                            ...accumulator, 
                            [this.state.translation[current_value]]: row[current_value]
                        }
                    ), {}
                )
            ); 
            let result = SubmitData("excel", this.ImportUrl(), data); 
            if(Number(result))
            {
                alert(`Nhập danh sách bằng Excel thành công`); 
                this.SetStateTable([]); 
                this.ExecPropsFunction("ImportExcelSuccess"); 
            }
            else 
            {
                alert("Nhập danh sách Excel thất bại, vui lòng thử lại"); 
            }
        }, 
        ReadExcelFile: async(event)=>
        {
            let empty = "__EMPTY"; 
            var file = event.currentTarget.files[0]; 
    
            var buffer = await file.arrayBuffer();
            var workbook = XLSX.read
            (
                buffer,
                {
                    type: "array"
                }
            );
            var worksheet = workbook.Sheets[workbook.SheetNames[0]];
            var json_data = XLSX.utils.sheet_to_json
            (
                worksheet,
                {
                    raw:false
                }
            ).filter(row=>row[empty]==undefined).map(row=>Object.keys(row).filter(key=>!key.includes(empty)).reduce((accumulator, current_value)=>({...accumulator, [current_value]:row[current_value]}), {}));
    
            this.SetStateTable(json_data); 
        }, 
        SetStateTable(table)
        {
            this.setState({table}); 
            this.ResetStateValue({value_name: "file_input", new_value: true}); 
        } 
    }; 
    render()
    {
        var Grid = MaterialUI.Grid; 
        var display_table = this.state.table.length?
        (
            <React.Fragment>
                <ScrollingTable table={this.state.table} />
                <ActionButton type="button" ActionButtonClick={this.ActionButtonClick} />
            </React.Fragment>
        ): null; 
        return (
            <React.Fragment>
                <Grid container spacing={3}>
                    <Grid item xs={6} justify="center" alignItems="center" container>
                        <MaterialUI.Link 
                            className="icon-same-line-word btn btn-outline" 
                            href={`../server/controller/excel/create_file.php?building_id=${this.BuildingId()}&controller=${this.CurrentController()}&lang=vn`}
                        >
                            <MaterialUI.Icon>grid_on</MaterialUI.Icon>
                            <b className="ml-2">Tải mẫu Excel</b>
                        </MaterialUI.Link>
                    </Grid>
                    <Grid item xs={6} justify="center" alignItems="center" container>
                        {
                            this.state.file_input && 
                            <React.Fragment>
                                <input type="file" onChange={this.ReadExcelFile} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" className="file-upload-input" id="file-upload" />
                                <label htmlFor="file-upload" className="file-upload-download-label btn btn-primary icon-same-line-word">
                                    <MaterialUI.Icon>cloud_download</MaterialUI.Icon>
                                    <b className="ml-2">Đưa tập tin Excel</b>
                                </label>
                            </React.Fragment>
                        }

                    </Grid>
                </Grid>
                {display_table}
            </React.Fragment>
        ); 
    }
}