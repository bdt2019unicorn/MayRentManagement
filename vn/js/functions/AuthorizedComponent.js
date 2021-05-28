class AuthorizedComponent extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.UpdateCurrentBuilding(); 
    }
    componentDidUpdate(previous_props, previous_state)
    {
        this.UpdateCurrentBuilding(); 
    }
    Methods = 
    {
        UpdateCurrentBuilding()
        {
            if(this.props.ChangeState)
            {
                this.props.ChangeState({state_name: "current_building", value: _.get(this.props, "match.params.building_id")}); 
            }
        }
    }
    render() 
    {
        let redirect_component = this.CheckLogin();
        return redirect_component || this.props.children; 
    }
}
AuthorizedComponent = ConnectComponent.Store(AuthorizedComponent); 