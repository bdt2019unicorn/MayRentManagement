class Overview extends PageWrapperChildrenComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        var controller = this.CurrentController() || "overview"; 
        var table = this.TableData(controller); 
        var translate_url = `../server/translation/Overview/${controller}.json`; 
        this.state = 
        {
            table_data: TranslateTable(table, translate_url), 
            table_actions: this.TableActions(controller), 
            translate: ServerJson("../server/translation/general.json")
        }; 
    }
    render() 
    {
        return (
            <React.Fragment>
                <h1>{_get(this.state.table_actions, "page_title") || "Tổng quát"}</h1>
                <ScrollingTable 
                    table={this.state.table_data} 
                    table_actions={this.state.table_actions} 
                    append={this.props.current_building} 
                    translate={this.state.translate}
                />


                <ScrollingTableTest  
                    table={this.state.table_data} 
                    table_actions={this.state.table_actions} 
                    append={this.props.current_building} 
                    translate={this.state.translate}
                />
            </React.Fragment>
        );
    }
}