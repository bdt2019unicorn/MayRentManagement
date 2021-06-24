class AddEditComponent extends PageWrapperChildrenComponent
{
    constructor(props)
    {
        super(props); 
        this.state = {form: this.LoadForm()}; 
    }
    componentDidUpdate(previous_props, previous_state)
    {
        let controller = this.CurrentController(); 
        let route_controller = _.get(previous_props, "match.params.controller"); 
        if ( (previous_props.controller!=controller) && (controller!=route_controller) )
        {
            this.setState({form: this.LoadForm(controller)}); 
        }
    }
    ReloadUserInput = (callback_resolve=undefined) => this.ResetStateValue({value_name: "form", new_value: _.cloneDeep(this.state.form), callback_resolve})
    render()
    {
        return this.state.form? (
            <UserInput 
                container_width={this.props.container_width} 
                edit_data={this.state.edit_data} 
                form={this.state.form} 
                match={this.props.match}
                permission={this.props.permission || this.props.controller=="user"}
                user_permissions={this.props.user_permissions}
                FormSubmitValid={this.FormSubmitValid} 
                ClearButton={this.Reset}
            />
        ): null; 
    }
}