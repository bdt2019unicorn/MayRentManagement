class PageWrapper extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        this.state = {sidebar: ServerJson("../server/json/sidebar/vn.json")}; 
    }
    render()
    {
        var Grid = MaterialUI.Grid; 
        var Route = ReactRouterDOM.Route; 
        return (
            <AuthorizedComponent match={this.props.match}>
                <Grid container>
                    <Grid className="p-1" item xs={3}>
                        <Sidebar sidebar={this.state.sidebar} controller={this.props.current_controller} {...this.props.match.params} />
                    </Grid>
                    <Grid className="p-3" item xs={9}>
                        <ReactRouterDOM.Switch>
                            <Route component={ConnectComponent.Store(Overview)} exact path="/:building_id"/>
                            {
                                this.state.sidebar.flatMap
                                (
                                    controller => controller.menu.filter(item=>window[item.action]).map 
                                    (
                                        item => <Route key={encodeURIComponent(JSON.stringify(item) + Math.random().toString())} component={ConnectComponent.Store(window[item.action])} exact path={`/:building_id/:controller/${item.action}`} />
                                    )
                                )
                            }
                            <Route component={ConnectComponent.Store(Edit)} exact path="/:building_id/:controller/Edit" />
                            <Route component={ConnectComponent.Store(EditInvoice)} exact path="/:building_id/:controller/EditInvoice" />
                        </ReactRouterDOM.Switch>
                    </Grid>
                </Grid>
            </AuthorizedComponent>
        ); 
    }
}
PageWrapper = ConnectComponent.Store(PageWrapper); 