class ScrollingTable extends React.Component
{
    constructor(props)
    {
        super(props); 
    }
    render()
    {
        const table_height = `${(80/100 * document.documentElement.clientHeight)}px`; 
        const column_width = "150"; 
        var columns = (this.props.table.length>0)?this.props.table.reduce
        (
            (previous_value, current_value)=>
            {
                let keys = Object.keys(current_value).filter(column=>!previous_value.includes(column)); 
                return [...previous_value, ...keys]; 
            }, this.props.id?[]:["id"]
        ): undefined; 
        if(!columns)
        {
            return null; 
        }

        let key_field = this.props.id||"id"; 

        let data = this.props.table.map
        (
            row=>
            (
                this.props.id ? row: 
                {
                    id: Object.values(row).join(" - "), 
                    ...row 
                }
            ) 
        ); 

        return (
            <div className="table-responsive container-fluid" style={this.props.style}>
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col">
                <BootstrapTable 
                    data={data} 
                    keyField={key_field} 
                    striped 
                    hover 
                    bordered 
                    pagination
                    height={table_height}
                    tableHeaderClass="table-dark"
                >
                    {columns.map
                    (
                        column=>
                        <TableHeaderColumn 
                            key={column} 
                            dataField={column} 
                            hidden={column==key_field} 
                            tdStyle={ { whiteSpace: 'normal', wordBreak: 'break-word' } } 
                            thStyle={ { whiteSpace: 'normal', wordBreak: 'break-word', position: 'sticky' }}
                            width={column_width}
                        >{column}</TableHeaderColumn>)}
                </BootstrapTable>  
                </div>
                <div className="col-2"></div>
                </div>     
            </div>    
        ); 
    }
}


class ImportExcel extends React.Component
{
    constructor(props)
    {
        super(props); 
        this.ReadExcelFile = this.ReadExcelFile.bind(this); 

        // BindFucntions(this); 
        this.state = 
        {
            table: []
        }
    }

    async ReadExcelFile(event)
    {
        var input = event.currentTarget; 
        console.log(event.currentTarget);
        console.log(input.files); 
        var file = input.files[0]; 

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

        console.log(json_data); 
        // this.state.table = json_data; 
        this.setState({table: json_data}); 
    }

    SupportFunction()
    {
        this.Test = function()
        {
            console.log("test"); 
        }; 
    }

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



class FullPage extends React.Component 
{
    constructor(props)
    {
        super(props); 
        var url = "../server/overview_controller/overview_controller.php?overview_controller=buildings"; 
        let buildings = support_mixin.methods.AjaxRequest(url); 
        this.state = 
        {
            value: "try me in state", 
            buildings: JSON.parse(buildings), 
        }
    }



    render()
    {
        let buildings = this.state.buildings.map(building=><p key={building.id}>{JSON.stringify(building)}</p>); 
        return (
            <React.Fragment>
                <ImportExcel />
                {buildings}
            </React.Fragment>
        ); 
    }
}