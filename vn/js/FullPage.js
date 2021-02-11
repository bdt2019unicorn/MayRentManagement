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
        return (
            <ReactRouterDOM.HashRouter>
                <Switch>
                    <Redirect from="/page-administration" exact to="/page-administration/login" />
                    <Route component={PageAdministration} path="/page-administration/:controller" />
                    
                    <Redirect from="/" exact to="/admin" />
                    <Route component={PageWrapper} path="/admin" />
                </Switch>
            </ReactRouterDOM.HashRouter>
        ); 
    }
}