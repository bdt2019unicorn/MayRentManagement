class TextInput extends SimpleInputComponent
{
    render() 
    {
        var Change = event =>
        {
            let value = event.target.value; 
            let state = {value}; 
            this.setState(state); 
            Emitter.emit("valueChange", state); 
        }; 
        return (
            <MaterialUI.TextField 
                size="medium"
                fullWidth
                name={this.props.name}
                label={this.props.title} 
                value={this.InnitialValue()} 
                type={this.props.type} 
                margin="normal"
                variant="outlined"
                onChange={Change}
                {...this.ValidationObject()}
            />
        );
    }
}



class TextGroupConfirmation extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.state = {value: undefined, confirm_value: undefined}; 
    }
    CustomEvents = 
    {
        "valueChange": (state)=> this.setState(state) 
    }
    Methods = 
    {
        ValidationObject()
        {
            if(!this.props.validations)
            {
                return undefined; 
            }
            let validations = validate
            (
                {
                    [this.props.name]:this.state.value, 
                    [this.props.confirm_name]: this.state.confirm_value 
                }, 
                {
                    [this.props.name]: this.props.validations
                }
            ); 
            var validation_object = 
            {
                error: Boolean(validations)
            }; 
            return validation_object.error? 
            {
                ...validation_object, 
                helperText: validations[this.props.name][0]
            }: validation_object
        }
    }
    render()
    {
        return (
            <React.Fragment>
                <TextInput {...this.props}/>
                <MaterialUI.TextField 
                    size="medium"
                    fullWidth
                    name={this.props.confirm_name}
                    label={this.props.confirm_title} 
                    // value={this.InnitialValue()} 
                    type={this.props.type} 
                    margin="normal"
                    variant="outlined"
                    onChange={(event)=>this.setState({confirm_value: event.target.value})}
                    {...this.ValidationObject()}
                />
            </React.Fragment>
        ); 
    }
}



class Child extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.state = {value: undefined}; 
    }
    render()
    {
        var Change = (event)=>
        {   
            let value = event.target.value; 
            this.setState({value: value}); 
            Emitter.emit("test", {value}); 
        }; 
        return (
            <div>
                <label>child</label>
                <input type="text" onChange={Change} />
            </div>
        ); 
    }
}

class Parent extends BaseComponent  
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.state = {value: undefined, confirm: undefined}; 
    }
    CustomEvents = 
    {
        "test": data =>
        {
            console.log(data); 
            this.setState(data); 
        }
    }
    render() 
    {
        var Change = event=>
        {
            this.setState({confirm: event.target.value}); 
        }
        return (
            <div>
                <Child />
                <label>parent</label>
                <input type="text" onChange={Change} />
                {(this.state.value==this.state.confirm) && <p>{this.state.value}-------{this.state.confirm}</p>}
            </div>         
        );
    }
}