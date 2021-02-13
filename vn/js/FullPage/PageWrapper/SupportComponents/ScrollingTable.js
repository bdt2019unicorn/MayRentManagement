class ScrollingTable extends React.Component
{
    render()
    {
        const table_height = `${(80/100 * document.documentElement.clientHeight)}px`; 
        const column_width = "150"; 
        var table_length; 
        try 
        {
            table_length = this.props.table.length; 
        } 
        catch (error) 
        {
            return null;     
        }
        var columns = table_length?this.props.table.reduce
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


class TestTable extends React.Component
{
    render()
    {
        const data = [
            { name: "John", email: "john@gmail.com", age: 12, gender: "Male" },
            { name: "Bren", email: "bren@gmail.com", age: 24, gender: "Male" },
            { name: "Marry", email: "marry@gmail.com", age: 18, gender: "Female" },
            { name: "Shohail", email: "shohail@gmail.com", age: 25, gender: "Male" },
            { name: "Aseka", email: "aseka@gmail.com", age: 19, gender: "Female" },
            { name: "Meuko", email: "meuko@gmail.com", age: 12, gender: "Female" },
          ];

          const columns = [
            {
              title: "Name",
              field: "name",
            },
            {
              title: "Email",
              field: "email",
            },
            {
              title: "Age",
              field: "age",
            },
            {
              title: "Gender",
              field: "gender",
            },
          ];

        //   return <BootstrapTable 
        //     data={data} 
        //     keyField="name"
        //     >
        //       {
        //           columns.map 
        //           (
        //               column => 
        //               <TableHeaderColumn 
        //                 key={column.field}
        //                 dataField={column.field}
        //             >{column.title}</TableHeaderColumn>
        //           )
        //       }
        //   </BootstrapTable>
    }
}

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
        var table_length; 
        try 
        {
            table_length = this.props.table.length; 
        } 
        catch (error) 
        {
            return null;     
        }
        var columns = table_length?this.props.table.reduce
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
