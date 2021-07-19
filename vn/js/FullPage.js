class FullPage extends BaseComponent 
{
    constructor(props)
    {
        super(props); 
        this.props.Authorize
        (
            {
                username: sessionStorage.getItem("username") ||"", 
                id: sessionStorage.getItem("user_id") ||""
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
                <div className="space-between-element">
                    <a href="../issues">Báo cáo vấn đề</a>
                    { _.get(this.props.user_permissions, "SystemAdmin") && <a href="../admin">Quản lí</a> }
                    <a className="float-right mr-3" href=".." title="English"><img src="../img/UK_flag.png" /></a>
                </div>
                {main_nav_items}
                <Switch>
                    <Redirect from="/page-administration" exact to="/page-administration/login" />
                    <Route component={PageAdministration} path="/page-administration/:controller" />
                    
                    <Redirect from="/" exact to="/dashboard" />
                    <Redirect from="/general-edit" exact to="/dashboard" />
                    <Route component={Dashboard} exact path="/dashboard" />

                    <Route component={GeneralEdit} exact path="/GeneralEdit/:controller" />

                    <Route component={PageWrapper} path="/:building_id/" />
                </Switch>
            </ReactRouterDOM.HashRouter>
        ); 
    }
}