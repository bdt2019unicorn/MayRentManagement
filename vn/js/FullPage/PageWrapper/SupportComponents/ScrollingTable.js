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
        var columns = _.get(this.props.table, "length")?this.props.table.reduce
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
        else
        {
            var hidden_columns = _.get(this.props.table_actions,"hidden_columns") || []; 
            var sort = _.get(this.props.table_actions, "sort") || {}; 
            var search = _.get(this.props.table_actions, "search") || []; 
            var special_list = _.get(this.props.table_actions,"special.list") || []; 
            var special = special_list.length? _.get(this.props.table_actions,"special"): undefined; 
            columns = 
            [
                {field: "id", hide: true}, 
                ...columns.map
                (
                    column=>
                    {
                        var definition = {field: column, headerName: column, flex: 1}; 
                        if(this.props.table_actions)
                        {
                            if(hidden_columns.includes(column))
                            {
                                definition.hide = true; 
                            }
                            else if(sort[column])
                            {
                                definition.sortComparator = (value1, value2, cell_params1, cell_params2)=>
                                {
                                    var field = sort[column]; 
                                    value1 = Number(cell_params1.row[field]); 
                                    value2 = Number(cell_params2.row[field]); 
                                    if(value1==value2)
                                    {
                                        return 0; 
                                    }
                                    else if(value1>value2)
                                    {
                                        return 1; 
                                    }
                                    else 
                                    {
                                        return -1; 
                                    }
                                }
                            }
                            else 
                            {
                                definition.sortable = false; 
                            }
                            if(special_list.includes(column))
                            {
                                
                            }
                        }
                        return definition; 
                    }
                )
            ]; 
        }

        var rows = this.props.table.map
        (
            row=>
            (
                {
                    id: encodeURIComponent(JSON.stringify(row) + Math.random()), 
                    ...row 
                }
            )
        ); 

        var Grid = MaterialUI.Grid; 

        return (
            <Grid className="mt-3" container justify="center">
                <Grid item xs={12}>
                    <MaterialUI.Paper className="scrolling-table-div-test">
                        <DataGrid 
                            rows={rows} 
                            columns={columns} 
                            checkboxSelection 
                            disableSelectionOnClick
                        />
                    </MaterialUI.Paper>
                </Grid>
            </Grid>
        ); 
    }
}