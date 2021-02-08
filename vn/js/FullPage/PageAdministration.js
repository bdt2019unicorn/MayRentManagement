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
        return (
            <div>
                {/* <UserInput form={this.state.form} /> */}
                <button type="button" onClick={()=>this.props.history.push("/page-administration/login")}>login</button>
                <button type="button" onClick={()=>this.props.history.push("/page-administration/user")}>register</button>
            </div>
        ); 
    }
}