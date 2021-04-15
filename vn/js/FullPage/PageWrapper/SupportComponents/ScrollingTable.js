class ScrollingTable extends React.Component
{
    render()
    {
        var hidden_columns = _.get(this.props.table_actions,"hidden_columns") || []; 
        var special_list = _.get(this.props.table_actions,"special.list") || []; 
        var special = special_list.length? _.get(this.props.table_actions,"special"): undefined; 
        var columns = _.get(this.props.table, "length")?this.props.table.reduce
        (
            (previous_value, current_value)=>
            {
                let keys = Object.keys(current_value).filter
                (
                    column=>! 
                    ( 
                        (previous_value.includes(column)) || 
                        (hidden_columns.includes(column)) 
                    ) 
                ); 
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
                                        columns.map(column=><Td className="text-white bg-gray-dark border" key={column}>{column}</Td>)
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
                                                    columns.map
                                                    (
                                                        column=> 
                                                        {
                                                            var custom_component = <Translate text={row[column]} translate={this.props.translate} />; 
                                                            if(special_list.includes(column))
                                                            {
                                                                for (var component in special) 
                                                                {
                                                                    if(special[component][column])
                                                                    {
                                                                        var Component = window[component]; 
                                                                        custom_component = <Component 
                                                                            html={row[column]} 
                                                                            row={row} 
                                                                            append={this.props.append} 
                                                                            special={special[component][column]} 
                                                                            translate={this.props.translate}
                                                                        />; 
                                                                        break; 
                                                                    }
                                                                }
                                                            }
                                                            return (
                                                                <Td 
                                                                    className="border" 
                                                                    key={encodeURIComponent(row[column] + Math.random().toString())}
                                                                >{custom_component}</Td>
                                                            ); 
                                                        }
                                                    )
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





class ScrollingTableTest extends React.Component
{
    render()
    {
        var hidden_columns = _.get(this.props.table_actions,"hidden_columns") || []; 
        var special_list = _.get(this.props.table_actions,"special.list") || []; 
        var special = special_list.length? _.get(this.props.table_actions,"special"): undefined; 
        var columns = _.get(this.props.table, "length")?this.props.table.reduce
        (
            (previous_value, current_value)=>
            {
                let keys = Object.keys(current_value).filter
                (
                    column=>! 
                    ( 
                        (previous_value.includes(column)) || 
                        (hidden_columns.includes(column)) 
                    ) 
                ); 
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
                                        columns.map(column=><Td className="text-white bg-gray-dark border" key={column}>{column}</Td>)
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
                                                    columns.map
                                                    (
                                                        column=> 
                                                        {
                                                            var custom_component = <Translate text={row[column]} translate={this.props.translate} />; 
                                                            if(special_list.includes(column))
                                                            {
                                                                for (var component in special) 
                                                                {
                                                                    if(special[component][column])
                                                                    {
                                                                        var Component = window[component]; 
                                                                        custom_component = <Component 
                                                                            html={row[column]} 
                                                                            row={row} 
                                                                            append={this.props.append} 
                                                                            special={special[component][column]} 
                                                                            translate={this.props.translate}
                                                                        />; 
                                                                        break; 
                                                                    }
                                                                }
                                                            }
                                                            return (
                                                                <Td 
                                                                    className="border" 
                                                                    key={encodeURIComponent(row[column] + Math.random().toString())}
                                                                >{custom_component}</Td>
                                                            ); 
                                                        }
                                                    )
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