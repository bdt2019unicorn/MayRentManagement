class ScrollingTable extends React.Component
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
                {field: "id", hide: true, filterable: false}, 
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
                                    var custom_component = <Translate text={params.value} translate={this.props.translate} />; 
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
                                                    translate={this.props.translate}
                                                />
                                            ); 
                                        }
                                    }
                                    return custom_component; 
                                }
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
                    <MaterialUI.Paper className="scrolling-table-div">
                        <MaterialUIDataGrid.DataGrid 
                            rows={rows} 
                            columns={columns} 
                            checkboxSelection={ _.get(this.props.table_actions, "id")}
                            disableSelectionOnClick
                            components=
                            {
                                {
                                    Toolbar: ()=>
                                    (
                                        <MaterialUIDataGrid.GridToolbarContainer>
                                            <MaterialUIDataGrid.GridFilterToolbarButton />
                                            <MaterialUIDataGrid.GridDensitySelector />
                                        </MaterialUIDataGrid.GridToolbarContainer>
                                    ) 
                                }
                            }
                            localeText=
                            {
                                {
                                    toolbarDensity: 'Kích cỡ',
                                    toolbarDensityLabel: 'Kích cỡ',
                                    toolbarDensityCompact: 'Nhỏ',
                                    toolbarDensityStandard: 'Vừa',
                                    toolbarDensityComfortable: 'Lớn',

                                    toolbarFilters: 'Tìm kiếm', 
                                    toolbarFiltersLabel: 'Tìm kiếm', 
                                    toolbarFiltersTooltipHide: 'Ẩn tìm kiếm', 
                                    toolbarFiltersTooltipShow: 'Hiện tìm kiếm', 

                                    filterPanelOperators: 'Cách tìm kiếm',
                                    filterPanelOperatorAnd: 'Và',
                                    filterPanelOperatorOr: 'Hoặc',
                                    filterPanelColumns: 'Cột',
                                    filterPanelInputLabel: 'Giá trị',
                                    filterPanelInputPlaceholder: 'Giá trị tìm kiếm',

                                    filterOperatorContains: 'Có giá trị',
                                    filterOperatorEquals: 'Bằng giá trị',
                                    filterOperatorStartsWith: 'Bắt đầu bằng',
                                    filterOperatorEndsWith: 'Kết thúc bằng',


                                    columnMenuShowColumns: 'Toàn bộ các cột',
                                    columnMenuFilter: 'Tìm kiếm',
                                    columnMenuHideColumn: 'Giấu cột',
                                    columnMenuUnsort: 'Hủy xắp xếp',
                                    columnMenuSortAsc: 'Xắp xếp từ thấp lên cao',
                                    columnMenuSortDesc: 'Xắp xếp từ cao xuống thấp'
                                  
                                }
                            }
                        />
                    </MaterialUI.Paper>
                </Grid>
            </Grid>
        ); 
    }
}