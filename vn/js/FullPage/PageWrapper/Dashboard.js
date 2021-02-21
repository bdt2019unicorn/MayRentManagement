class Dashboard extends AuthorizedComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
    }
    componentDidUpdate(previous_props, previous_state)
    {
        super.componentDidUpdate(previous_props, previous_state); 
    }
    Methods = 
    {
    }
    render()
    {
        let redirect_component = this.CheckLogin(); 
        if(redirect_component)
        {
            return redirect_component; 
        }
        return (
            <div>dashboard</div>
        ); 
    }
}

Dashboard = ConnectComponentToStore(Dashboard); 