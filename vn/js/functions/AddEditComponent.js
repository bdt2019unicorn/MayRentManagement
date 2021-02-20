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
        }
    }
    render()
    {
        return (
            this.state.form?<UserInput form={this.state.form} container_width={this.props.container_width} edit_data={this.state.edit_data} />: null
        ); 
    }
}