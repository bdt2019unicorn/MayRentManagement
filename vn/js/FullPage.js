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
        return (
            <ReactRouterDOM.HashRouter>
                <Switch>
                    <Route component={Dashboard} exact path="/" />
                    <Route component={PageAdministration} exact path="/page-administration/" />
                    <Route component={PageAdministration} path="/page-administration/:controller" />
                </Switch>
            </ReactRouterDOM.HashRouter>
        ); 
    }
}