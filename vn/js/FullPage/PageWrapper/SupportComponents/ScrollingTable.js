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
                    {
                        columns.map
                        (
                            column=>
                            <TableHeaderColumn 
                                key={column} 
                                dataField={column} 
                                hidden={column==key_field} 
                                tdStyle={ { whiteSpace: 'normal', wordBreak: 'break-word' } } 
                                thStyle={ { whiteSpace: 'normal', wordBreak: 'break-word', position: 'sticky' }}
                                width={column_width}
                            >{column}</TableHeaderColumn>
                        )
                    }
                </BootstrapTable>  
            </div>    
        ); 
    }
}