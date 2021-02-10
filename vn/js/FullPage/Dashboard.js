class Dashboard extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        this.Methods = {...this.Methods, ...BaseComponent.Methods}; 
        BindFunctions(this); 
    }
    componentDidUpdate(previous_props, previous_state)
    {
    }
    Methods = 
    {
    }
    render()
    {
        if(!(this.props.username && this.props.user_id))
        {
            return <ReactRouterDOM.Redirect to="/page-administration/login" />; 
        }
        return (
            <div>dashboard</div>
        ); 
    }
}

Dashboard = ReactRedux.connect(PageSetup.MapStateToProps)(Dashboard); 