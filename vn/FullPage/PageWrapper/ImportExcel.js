class ImportExcel extends React.Component
{
    constructor(props)
    {
        super(props); 
        BindFucntions(this); 
        this.state = 
        {
            table: []
        }
    }

    Methods = 
    {
        ReadExcelFile: async(event)=>
        {
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
            );
    
            this.setState({table: json_data}); 
        }
    }; 

    render()
    {
        return (
            <React.Fragment>
                <input type="file" onChange={this.ReadExcelFile} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"  />
                <ScrollingTable table={this.state.table} />
            </React.Fragment>
        ); 
    }
}