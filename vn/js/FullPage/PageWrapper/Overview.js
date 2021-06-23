class Overview extends PageWrapperChildrenComponent
{
    constructor(props)
    {
        super(props); 
        var controller = this.CurrentController() || "overview"; 
        var table = this.TableData(controller); 
        var translate_url = TranslationValues.TranslateUrl(controller); 
        this.state = 
        {
            controller, 
            selected: [], 
            table_actions: TableAction(controller),
            table_data: TranslationValues.TranslateTable(table, translate_url), 
            translate_url 
        }; 
    }
    render() 
    {
        var DeleteSuccess = () => this.setState
        (
            {
                selected: [], 
                table_data: TranslationValues.TranslateTable(this.TableData(this.state.controller), this.state.translate_url)
            }
        ); 
        var PageTitle = () => _.get(this.state.table_actions, "page_title") || "Tổng quát"; 
        var ExportExcel = () =>
        {
            var hidden_columns = _.get(this.state.table_actions,"hidden_columns") || []; 
            var table = this.state.table_data.map
            (
                row=> Object.keys(row).filter(column=>!hidden_columns.includes(column)).reduce
                (
                    (accumulator, current_value)=>
                    (
                        {
                            ...accumulator, 
                            [current_value]: TranslationValues.Translate(row[current_value])
                        }
                    ), {}
                )
            ); 
            var page_title = PageTitle(); 
            var worksheet = XLSX.utils.json_to_sheet(table); 
            var workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, page_title);
            XLSX.writeFile(workbook, `${page_title}.xlsx`);
        } 
        var action = this.state.table_actions.edit_action || "Edit"; 
        return (
            <React.Fragment>
                <h1 className="d-flex">
                    {PageTitle()} 
                    <span className="d-flex-right-push space-between-element">
                        <MaterialUI.Button
                            className="btn-primary text-white"
                            size="large"
                            startIcon={<MaterialUI.Icon>view_comfy</MaterialUI.Icon>}
                            onClick={ExportExcel}
                        >Xuất Excel</MaterialUI.Button>
                    </span>
                </h1>
                <ScrollingTable 
                    append={this.props.current_building} 
                    table={this.state.table_data} 
                    table_actions={this.state.table_actions} 
                    selected={this.state.selected}
                    SelectionModelChanged={(selected)=>this.setState({selected})}
                >
                    {
                        this.state.controller!="overview" && 
                        <TableActions 
                            selected={this.state.selected}
                            params=
                            {
                                {
                                    building_id: this.props.current_building, 
                                    controller: this.state.controller, 
                                    action: action
                                }
                            }
                            controller={this.state.controller}
                            DeleteSuccess={DeleteSuccess}
                        />
                    }</ScrollingTable>
            </React.Fragment>
        );
    }
}