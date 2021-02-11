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
        return (
            <React.Fragment>
                <input type="file" onChange={this.ReadExcelFile} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"  />
                <ScrollingTable table={this.state.table} />
            </React.Fragment>
        ); 
    }
}