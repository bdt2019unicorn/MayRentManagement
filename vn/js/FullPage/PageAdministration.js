class PageAdministration extends React.Component 
{
    constructor(props)
    {
        super(props); 
        BindFucntions(this); 
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
    static getDerivedStateFromProps(next_props, previous_state)
    {
        return null; 
    }
    Methods = 
    {
        TestMethod()
        {
            var key = Object.keys(this.state.data)[0]; 
            let data = ImmutabilityHelper(this.state.data, {[key]: {$set: "I am testing"}}); 
            // data[key] = "test me"; 
            // let test_data = ImmutabilityHelper(data, {[key]: {$set: 1231}}); 
            this.setState({data}); 
            console.log(this.state); 

        }, 
        DataObject(form)
        {
            return form.flatMap(row=>row).map(component=>component.name).reduce((accumulator, current_value)=>({...accumulator, [current_value]: undefined}), 
            {
                test: {
                    form: 
                    {
                        a: 1, 
                        b: 2 
                    }
                }
            }); 
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
    }; 
    render()
    {
        console.log(this.state); 
        var data = this.state.data; 
        var key = Object.keys(data)[0]; 
        return (
            <div>
                <h1>{this.state.form.title}</h1>
                <h2>{data[key]}</h2>
                <button type="button" onClick={()=>this.props.history.push("/page-administration/login")}>login</button>
                <button type="button" onClick={()=>this.props.history.push("/page-administration/user")}>register</button>
                <button type="button" onClick={this.TestMethod}>TestMethod</button>
            </div>
        ); 
    }
}