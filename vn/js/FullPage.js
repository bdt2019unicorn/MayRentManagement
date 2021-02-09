class FullPage extends React.Component 
{
    constructor(props)
    {
        super(props); 
        var url = "../server/overview_controller/overview_controller.php?overview_controller=buildings"; 
        let buildings = AjaxRequest(url); 
        this.state = 
        {
            // buildings: JSON.parse(buildings) 
        }; 
    }

    render()
    {
        // let buildings = this.state.buildings.map(building=><p key={building.id}>{JSON.stringify(building)}</p>); 
        let Switch = ReactRouterDOM.Switch; 
        let Link = ReactRouterDOM.Link; 
        let Route = ReactRouterDOM.Route; 
        return (
            <ReactRouterDOM.HashRouter>
                {/* <ImportExcel /> */}
                {/* {buildings} */}
                <Switch>
                    <Route component={PageAdministration} 
                        exact 
                        path="/page-administration/" 
                        render={props=>(<ReactRouterDOM.Redirect to="/page-administration/login" />)} 
                    />
                    <Route component={PageAdministration} path="/page-administration/:controller" />
                </Switch>
            </ReactRouterDOM.HashRouter>
        ); 
    }
}