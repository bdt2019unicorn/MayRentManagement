class PageAdministration extends React.Component 
{
    constructor(props)
    {
        super(props); 
        BindFucntions(this); 
        this.state = 
        {
            form: this.LoadForm()
        }
    }

    static getDerivedStateFromProps(next_props, previous_state)
    {
        return null; 
    }

    componentDidUpdate(previous_props, previous_state)
    {
        if(previous_props.match.params.controller!=this.props.match.params.controller)
        {
            this.setState({form: this.LoadForm()}); 
        }
    }

    Methods = 
    {
        LoadForm()
        {
            let controller = this.props.match.params.controller; 
            let form = AjaxRequest(`../server/user_input_controller/${controller}.json`); 
            return JSON.parse(form); 
        }
    }; 
    render()
    {
        return (
            <div>
                <h1>{this.state.form.title}</h1>
                <button type="button" onClick={()=>this.props.history.push("/page-administration/login")}>login</button>
                <button type="button" onClick={()=>this.props.history.push("/page-administration/user")}>register</button>
            </div>
        ); 
    }
}