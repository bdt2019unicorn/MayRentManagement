class FullPage extends BaseComponent 
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.props.Authorize
        (
            {
                username: sessionStorage.getItem("username") ||"", 
                user_id: sessionStorage.getItem("user_id") ||""
            }
        ); 
        this.BuildingData(); 
    }
    render()
    {
        let Switch = ReactRouterDOM.Switch; 
        let Route = ReactRouterDOM.Route; 
        let Redirect = ReactRouterDOM.Redirect; 
        let main_nav_items = this.CheckLogin(null, <MainNavItems building_id={this.props.current_building} />); 
        return (
            <ReactRouterDOM.HashRouter>
                {main_nav_items}
                <Switch>
                    <Redirect from="/page-administration" exact to="/page-administration/login" />
                    <Route component={PageAdministration} path="/page-administration/:controller" />
                    
                    <Redirect from="/" exact to="/dashboard" />
                    <Redirect from="/general-edit" exact to="/dashboard" />
                    <Route component={Dashboard} exact path="/dashboard" />

                    <Route component={GeneralEdit} exact path="/general-edit/:controller" />

                    <Route component={PageWrapper} path="/:building_id/" />
                </Switch>
            </ReactRouterDOM.HashRouter>
        ); 
    }
}