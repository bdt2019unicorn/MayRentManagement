class ImportExcel extends React.Component
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.state = 
        {
            table: []
        }
    }

    Methods = 
    {
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
    
            this.setState({table: json_data}); 
        }
    }; 

    render()
    {
        var Grid = MaterialUI.Grid; 
        var display_table = this.state.table.length?
        (
            <ScrollingTable table={this.state.table} />
        ): null; 
        return (
            <React.Fragment>
                <Grid container spacing={1}>
                    <Grid item xs={6} justify="center" alignItems="center" container>
                        <MaterialUI.Link 
                            className="icon-same-line-word btn btn-outline" 
                            href={`../server/excel_controller/create_file.php?building_id=${this.props.match.params.building_id}&controller=${this.props.match.params.controller}&lang=vn`}
                        >
                            <MaterialUI.Icon>grid_on</MaterialUI.Icon>
                            <b className="ml-2">Tải mẫu Excel</b>
                        </MaterialUI.Link>
                    </Grid>
                    <Grid item xs={6} justify="center" alignItems="center" container>
                        <input type="file" onChange={this.ReadExcelFile} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" className="file-upload-input" id="file-upload" />
                        <label htmlFor="file-upload" className="file-upload-label btn btn-primary icon-same-line-word">
                            <MaterialUI.Icon>cloud_download</MaterialUI.Icon>
                            <b className="ml-2">Đưa tập tin Excel</b>
                        </label>
                    </Grid>
                </Grid>
                {display_table}
            </React.Fragment>
        ); 
    }
}