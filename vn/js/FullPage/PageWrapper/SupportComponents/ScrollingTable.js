class ScrollingTable extends React.Component
{
    render()
    {
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
            }, []
        ): undefined; 
        if(!columns)
        {
            return null; 
        }


        // let data = this.props.table.map
        // (
        //     row=>
        //     (
        //         this.props.id ? row: 
        //         {
        //             id: Object.values(row).join(" - "), 
        //             ...row 
        //         }
        //     ) 
        // ); 

        
        var Grid = MaterialUI.Grid; 

        var Td = MaterialUI.TableCell; 
        var Tr = MaterialUI.TableRow; 

        return (
            <Grid className="mt-3" container justify="center">
                <Grid item xs={12}>
                    <MaterialUI.TableContainer className="scrolling-table-div" component={MaterialUI.Paper}>
                        <MaterialUI.Table stickyHeader>
                            <MaterialUI.TableHead>
                                <Tr>
                                    {
                                        columns.map(column=><Td key={column}>{column}</Td>)
                                    }
                                </Tr>
                            </MaterialUI.TableHead>
                            <MaterialUI.TableBody>
                                {
                                    this.props.table.map 
                                    (
                                        row => (
                                            <Tr key={encodeURIComponent(JSON.stringify(row) + Math.random().toString())}>
                                                {
                                                    columns.map(column=> <Td key={encodeURIComponent(row[column] + Math.random().toString())}>{row[column]}</Td>)
                                                }
                                            </Tr>
                                        )
                                    )
                                }
                            </MaterialUI.TableBody>
                        </MaterialUI.Table>
                    </MaterialUI.TableContainer>
                </Grid>
            </Grid>
        ); 

    /*

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

    */
    }
}


class TestTable extends React.Component
{
    render()
    {
        var data = [
            { name: "John", email: "john@gmail.com", age: 12, gender: "Male" },
            { name: "Bren", email: "bren@gmail.com", age: 24, gender: "Male" },
            { name: "Marry", email: "marry@gmail.com", age: 18, gender: "Female" },
            { name: "Shohail", email: "shohail@gmail.com", age: 25, gender: "Male" },
            { name: "Aseka", email: "aseka@gmail.com", age: 19, gender: "Female" },
            { name: "Meuko", email: "meuko@gmail.com", age: 12, gender: "Female" },
          ];
          data = this.props.table? this.props.table: data; 

          const table_height = `${(80/100 * document.documentElement.clientHeight)}px`; 


          ////////
    {
        

          var table_length; 
          try 
          {
              table_length = data.length; 
          } 
          catch (error) 
          {
              return null;     
          }

          var columns = table_length?data.reduce
          (
              (previous_value, current_value)=>
              {
                  let keys = Object.keys(current_value).filter(column=>!previous_value.includes(column)); 
                  return [...previous_value, ...keys]; 
              }, []
          ): undefined; 
          if(!columns)
          {
              return null; 
          }


    }


          ///////


          console.log(columns); 


        //   const columns = [
        //     {
        //       title: "Name",
        //       field: "name",
        //     },
        //     {
        //       title: "Email",
        //       field: "email",
        //     },
        //     {
        //       title: "Age",
        //       field: "age",
        //     },
        //     {
        //       title: "Gender",
        //       field: "gender",
        //     },
        //   ];

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

        var Grid = MaterialUI.Grid; 

        var Td = MaterialUI.TableCell; 
        var Tr = MaterialUI.TableRow; 

        return (
            <Grid className="mt-3" container justify="center">
                <Grid item xs={12}>
                    <MaterialUI.TableContainer className="scrolling-table-div" component={MaterialUI.Paper}>
                        <MaterialUI.Table stickyHeader>
                            <MaterialUI.TableHead>
                                <Tr>
                                    {
                                        columns.map(column=><Td key={column}>{column}</Td>)
                                    }
                                </Tr>
                            </MaterialUI.TableHead>
                            <MaterialUI.TableBody>
                                {
                                    data.map 
                                    (
                                        row => (
                                            <Tr key={encodeURIComponent(JSON.stringify(row) + Math.random().toString())}>
                                                {
                                                    columns.map(column=> <Td key={encodeURIComponent(row[column] + Math.random().toString())}>{row[column]}</Td>)
                                                }
                                            </Tr>
                                        )
                                    )
                                }
                            </MaterialUI.TableBody>
                        </MaterialUI.Table>
                    </MaterialUI.TableContainer>
                </Grid>
            </Grid>
        ); 
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
