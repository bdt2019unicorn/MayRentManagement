class AddEditComponent extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        AddEditComponent.Methods = {...AddEditComponent.Methods, ...BaseComponent.Methods}; 
    }
    componentDidUpdate(previous_props, previous_state)
    {
        let controller = this.CurrentController(); 
        if(previous_props.controller!=controller)
        {
            this.setState({form: this.LoadForm(controller)}); 
        }
    }
    static Methods = 
    {
        InnitialState()
        {
            this.state = {form: this.LoadForm()}; 
        }, 
        ReloadUserInput(callback_resolve=undefined)
        {
            this.ResetStateValue({value_name: "form", new_value: _.cloneDeep(this.state.form), callback_resolve}); 
        }
    }
    render()
    {
        return (
            this.state.form?<UserInput form={this.state.form} container_width={this.props.container_width} edit_data={this.state.edit_data} />: null
        ); 
    }
}