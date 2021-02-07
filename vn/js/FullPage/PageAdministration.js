class PageAdministration extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        this.Methods = {...this.Methods, ...BaseComponent.Methods}; 
        BindFunctions(this); 
        let form = this.LoadForm(); 
        this.state = 
        {
            form, 
            data: this.DataObject(form.form)
        }; 
    }
    componentDidUpdate(previous_props, previous_state)
    {
        if(previous_props.match.params.controller!=this.props.match.params.controller)
        {
            this.InnitializeState(); 
        }
    }
    Methods = 
    {
        DataObject(form)
        {
            return form.flatMap(row=>row).map(component=>component.name).reduce((accumulator, current_value)=>({...accumulator, [current_value]: undefined}), {}); 
        }, 
        InnitializeState()
        {
            let form = this.LoadForm(); 
            this.setState
            (
                {
                    form, 
                    data: this.DataObject(form.form)
                }
            ); 
        }, 
        LoadForm()
        {
            let controller = this.props.match.params.controller; 
            let form = AjaxRequest(`../server/user_input_controller/${controller}.json`); 
            return JSON.parse(form); 
        }
    }
    render()
    {
        return (
            <div>
                <UserInput form={this.state.form} />
                <button type="button" onClick={()=>this.props.history.push("/page-administration/login")}>login</button>
                <button type="button" onClick={()=>this.props.history.push("/page-administration/user")}>register</button>
            </div>
        ); 
    }
}