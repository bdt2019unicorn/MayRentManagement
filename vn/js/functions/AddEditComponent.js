class AddEditComponent extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        AddEditComponent.Methods = {...AddEditComponent.Methods, ...BaseComponent.Methods}; 
    }
    // componentDidUpdate(previous_props, previous_state)
    // {
    //     let controller = this.CurrentController(); 
    //     if(previous_state.controller!=controller)
    //     {
    //         this.setState({controller}); 
    //     }
    // }
    static Methods = 
    {
        InnitialState()
        {
            this.state = {form: this.LoadForm()}; 
        }, 
        LoadForm()
        {
            let controller = this.CurrentController(); 
            let form = AjaxRequest(`../server/user_input_controller/vn/${controller}.json`); 
            return JSON.parse(form); 
        }
    }
    render()
    {
        return (
            <UserInput form={this.state.form} container_width={this.props.container_width} edit_data={this.state.edit_data} />
        ); 
    }
}