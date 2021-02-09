class PageAdministration extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        this.Methods = {...this.Methods, ...BaseComponent.Methods}; 
        BindFunctions(this); 
        this.state = {form: this.LoadForm()}; 
    }
    componentDidUpdate(previous_props, previous_state)
    {
        if(previous_props.match.params.controller!=this.CurrentController())
        {
            this.setState({form: this.LoadForm()}); 
        }
    }
    Methods = 
    {
        LoadForm()
        {
            let controller = this.CurrentController(); 
            let form = AjaxRequest(`../server/user_input_controller/vn/${controller}.json`); 
            return JSON.parse(form); 
        }
    }
    render()
    {
        let container_width = "sm"; 
        let controller = this.CurrentController(); 
        let Link = ReactRouterDOM.Link; 
        return (
            <MaterialUI.Grid container alignItems="center" justify="center">
                <MaterialUI.Container maxWidth={container_width} fixed>
                    <MaterialUI.Grid container alignItems="center" justify="center" spacing={2}>
                        <MaterialUI.Grid container alignItems="center" justify="center">
                            <img src="../img/logo.png" alt="logo" />
                        </MaterialUI.Grid>
                        
                        <MaterialUI.Grid item xs={6}>
                            <Link className={ItemsClasses("login", controller, "btn btn-block", "btn-primary", "btn-outline")} to="/page-administration/login">Đăng nhập</Link>
                        </MaterialUI.Grid>
                        <MaterialUI.Grid item xs={6}>
                            <Link className={ItemsClasses("user", controller, "btn btn-block", "btn-primary", "btn-outline")} to="/page-administration/user">Đăng kí</Link>
                        </MaterialUI.Grid>

                    </MaterialUI.Grid>

                </MaterialUI.Container>
                <UserInput form={this.state.form} container_width={container_width} />
            </MaterialUI.Grid>
        ); 
    }
}