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
    }
}