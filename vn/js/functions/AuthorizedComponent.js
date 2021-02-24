class AuthorizedComponent extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.PageWrapperUpdate(); 
    }
    componentDidUpdate(previous_props, previous_state)
    {
        this.PageWrapperUpdate(); 
    }
    Methods = 
    {
        PageWrapperUpdate()
        {
            if(this.props.ChangeState)
            {
                this.props.ChangeState({state_name: "current_building", value: _.get(this.props, "match.params.building_id")}); 
            }
        }
    }
}