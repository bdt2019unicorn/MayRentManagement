class FullPage extends BaseComponent 
{
    constructor(props)
    {
        super(props); 
        this.props.Authorize
        (
            {
                username: sessionStorage.getItem("username") ||"", 
                user_id: sessionStorage.getItem("user_id") ||""
            }
        ); 
    }
    render()
    {
        let Switch = ReactRouterDOM.Switch; 
        let Route = ReactRouterDOM.Route; 
        let Redirect = ReactRouterDOM.Redirect; 
        let main_nav_items = (this.props.username && this.props.user_id)? <MainNavItems />: null; 
        return (
            <React.Fragment>
                {main_nav_items}
                <ReactRouterDOM.HashRouter>
                    <Switch>
                        <Redirect from="/page-administration" exact to="/page-administration/login" />
                        <Route component={PageAdministration} path="/page-administration/:controller" />
                        
                        <Redirect from="/" exact to="/dashboard" />
                        <Route exact to="dashboard" />

                        <Route component={PageWrapper} exact path="/:building_id/:controller/:action" />
                    </Switch>
                </ReactRouterDOM.HashRouter>
            </React.Fragment>
        ); 
    }
}