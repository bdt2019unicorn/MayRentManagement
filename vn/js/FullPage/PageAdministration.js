class PageAdministration extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        this.Methods = {...this.Methods, ...BaseComponent.Methods}; 
        BindFunctions(this); 
        this.state = {controller: this.CurrentController()}; 
    }
    CustomEvents = 
    {
        "authorizeSuccess": (controller, data, result)=> 
        {
            switch (controller) 
            {
                case "login":
                    this.props.Authorize
                    (
                        {
                            username: data.username, 
                            user_id: result
                        }
                    ); 
                    break;
            
                default:
                    this.setState({controller: undefined}); 
                    break;
            }
        }
    }
    componentDidUpdate(previous_props, previous_state)
    {
        let controller = this.CurrentController(); 
        if(previous_state.controller!=controller)
        {
            this.setState({controller}); 
        }
    }
    render()
    {
        if(this.props.username && this.props.user_id)
        {
            return <ReactRouterDOM.Redirect to="/admin" />; 
        }
        if(!this.state.controller)
        {
            return <ReactRouterDOM.Redirect to="/page-administration/login" />; 
        }
        let container_width = "sm"; 
        let Link = ReactRouterDOM.Link; 
        return (
            <MaterialUI.Grid container alignItems="center" justify="center">
                <MaterialUI.Container maxWidth={container_width} fixed>
                    <MaterialUI.Grid container alignItems="center" justify="center" spacing={2}>
                        <MaterialUI.Grid container alignItems="center" justify="center">
                            <img src="../img/logo.png" alt="logo" />
                        </MaterialUI.Grid>
                        
                        <MaterialUI.Grid item xs={6}>
                            <Link className={ItemsClasses("login", this.state.controller, "btn btn-block", "btn-primary", "btn-outline")} to="/page-administration/login">Đăng nhập</Link>
                        </MaterialUI.Grid>
                        <MaterialUI.Grid item xs={6}>
                            <Link className={ItemsClasses("user", this.state.controller, "btn btn-block", "btn-primary", "btn-outline")} to="/page-administration/user">Đăng kí</Link>
                        </MaterialUI.Grid>

                    </MaterialUI.Grid>

                </MaterialUI.Container>
                <Add controller={this.state.controller} container_width={container_width} />
            </MaterialUI.Grid>
        ); 
    }
}

PageAdministration = ConnectComponentToStore(PageAdministration); 