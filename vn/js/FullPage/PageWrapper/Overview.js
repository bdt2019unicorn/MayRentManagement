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
            table_data: TranslationValues.TranslateTable(table, translate_url), 
            table_actions: this.TableActions(controller)
        }; 
    }
    render() 
    {
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
                >{this.state.controller!="overview" && <TableActions />}</ScrollingTable>
            </React.Fragment>
        );
    }
}