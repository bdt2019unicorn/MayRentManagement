class Overview extends PageWrapperChildrenComponent
{
    constructor(props)
    {
        super(props); 
        var controller = this.CurrentController() || "overview"; 
        var table = this.TableData(controller); 
        var translate_url = `../server/translation/Overview/${controller}.json`; 
        this.state = 
        {
            controller, 
            selected: [], 
            table_actions: this.TableActions(controller),
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
        return (
            <React.Fragment>
                <h1 className="d-flex">
                    {_get(this.state.table_actions, "page_title") || "Tổng quát"} 
                    <span className="d-flex-right-push">
                        <MaterialUI.Button
                            className="btn-primary text-white"
                            size="large"
                            startIcon={<MaterialUI.Icon>view_comfy</MaterialUI.Icon>}
                        >Xuất Excel</MaterialUI.Button>
                    </span>
                </h1>
                <ScrollingTable 
                    table={this.state.table_data} 
                    table_actions={this.state.table_actions} 
                    append={this.props.current_building} 
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
                                    action: this.state.table_actions.edit_action || "Edit"
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