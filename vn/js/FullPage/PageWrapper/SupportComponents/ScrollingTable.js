/*

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

*/


class ScrollingTable extends React.Component
{
    constructor(props)
    {
        super(props); 
    }
    render()
    {
        // const table_height = `${(80/100 * document.documentElement.clientHeight)}px`; 
        // const column_width = "150"; 

        // var columns = (this.props.table.length>0)?this.props.table.reduce
        // (
        //     (accumulator, current_value)=>
        //     {
        //         let keys = Object.keys(current_value).filter(column=>!accumulator.includes(column)); 
        //         return [...accumulator, ...keys]; 
        //     }, []
        // ): undefined; 
        // if(!columns)
        // {
        //     return null; 
        // }
        // columns = columns.map 
        // (
        //     column =>
        //     (
        //         {
        //             field: column, 
        //             headerName: column, 
        //             width: column_width
        //         }
        //     ) 
        // ); 

        const rows = [
            { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
            { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
            { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
            { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
            { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
            { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
            { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
            { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
            { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
          ];

          const columns = [
            { field: 'id', headerName: 'ID', width: 70 },
            { field: 'firstName', headerName: 'First name', width: 130 },
            { field: 'lastName', headerName: 'Last name', width: 130 },
            {
              field: 'age',
              headerName: 'Age',
              type: 'number',
              width: 90,
            }
          ];

        return (
            <div className="scrolling-table-div">
                {/* <DataGrid.DataGrid rows={this.props.table} columns={columns} pageSize={5} checkboxSelection /> */}
                <DataGrid.DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
            </div>
        ); 
    }
}