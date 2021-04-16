class ScrollingTable extends React.Component
{
    constructor(props)
    {
        super(props); 
        this.state = 
        {
            components: 
            {
                Toolbar: ()=>
                (
                    <MaterialUIDataGrid.GridToolbarContainer>
                        <MaterialUIDataGrid.GridFilterToolbarButton />
                        <MaterialUIDataGrid.GridDensitySelector />
                        {this.props.children}
                    </MaterialUIDataGrid.GridToolbarContainer>
                ) 
            }, 
            locale_text: ServerJson("../server/translation/ScrollingTable.json")
        }
    }
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
            var width = _.get(this.props.table_actions, "width") || {}; 
            var special_list = _.get(this.props.table_actions,"special.list") || []; 
            var special = special_list.length? _.get(this.props.table_actions,"special"): undefined; 
            columns = 
            [
                {field: "id", hide: true, filterable: false}, 
                ...columns.map
                (
                    column=>
                    {
                        var definition = {field: column, headerName: column, width: width[column]|| 200}; 
                        if(this.props.table_actions)
                        {
                            if(hidden_columns.includes(column))
                            {
                                definition.hide = true; 
                                definition.filterable = false; 
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
                            if(!search.includes(column))
                            {
                                definition.filterable = false; 
                            }
                            if(special_list.includes(column))
                            {
                                definition.renderCell = (params)=>
                                {
                                    var custom_component = TranslationValues.Translate(params.value) || null; 
                                    for (var component in special) 
                                    {
                                        if(special[component][column])
                                        {
                                            var Component = window[component]; 
                                            return (
                                                <Component 
                                                    html={params.value} 
                                                    row={params.row} 
                                                    append={this.props.append} 
                                                    special={special[component][column]} 
                                                />
                                            ); 
                                        }
                                    }
                                    return custom_component; 
                                }; 
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
                    id: md5(JSON.stringify(row) + Math.random()), 
                    ...row 
                }
            )
        ); 
        var Grid = MaterialUI.Grid; 

        return (
            <Grid className="mt-3" container justify="center">
                <Grid item xs={12}>
                    <MaterialUI.Paper className="scrolling-table-div">
                        <MaterialUIDataGrid.DataGrid 
                            rows={rows} 
                            columns={columns} 
                            checkboxSelection={ _.get(this.props.table_actions, "id")}
                            disableSelectionOnClick
                            components={this.state.components}
                            localeText={this.state.locale_text}
                        />
                    </MaterialUI.Paper>
                </Grid>
            </Grid>
        ); 
    }
}