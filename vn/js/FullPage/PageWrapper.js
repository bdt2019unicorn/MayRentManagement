class PageWrapper extends AuthorizedComponent
{
    constructor(props)
    {
        super(props); 
        this.state = {sidebar: ServerJson("sidebar.json")}; 
    }
    render()
    {
        let redirect_component = this.CheckLogin(); 
        if(redirect_component)
        {
            return redirect_component; 
        }
        var Grid = MaterialUI.Grid; 
        var Route = ReactRouterDOM.Route; 
        return (
            <Grid container>
                <Grid className="p-1" item xs={3}>
                    <Sidebar sidebar={this.state.sidebar} controller={this.props.current_controller} {...this.props.match.params} />
                </Grid>
                <Grid className="p-3" item xs={9}>
                    <ReactRouterDOM.Switch>
                        {
                            this.state.sidebar.flatMap
                            (
                                controller => controller.menu.filter(item=>window[item.action]).map 
                                (
                                    item => <Route key={encodeURIComponent(JSON.stringify(item) + Math.random().toString())} component={ConnectComponentToStore(window[item.action])} exact path={`/:building_id/:controller/${item.action}`} />
                                )
                            )
                        }
                    </ReactRouterDOM.Switch>
                </Grid>
            </Grid>
        ); 
    }
}
PageWrapper = ConnectComponentToStore(PageWrapper); 