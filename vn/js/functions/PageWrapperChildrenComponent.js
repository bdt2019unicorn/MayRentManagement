class PageWrapperChildrenComponent extends BaseComponent
{
    componentDidMount() 
    {
        let current_controller = _.get(this.props, "match.params.controller"); 
        if(this.props.ChangeState && current_controller!=this.props.current_controller)
        {
            this.props.ChangeState({state_name: "current_controller", value: current_controller}); 
        }
    }
}