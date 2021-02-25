class TextInput extends SimpleInputComponent
{
    render() 
    {
        var Change = event =>
        {
            let value = event.target.value; 
            let state = {value}; 
            this.setState(state); 
            if(this.props.ValueChange)
            {
                this.props.ValueChange(state); 
            }
        }; 
        return (
            <MaterialUI.TextField 
                size="medium"
                fullWidth
                name={this.props.name}
                label={this.props.title.replaceAll("*","").trim()} 
                value={this.state.value || ""} 
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
    Methods = 
    {
        ValidationObject()
        {
            let validations = validate
            (
                {
                    [this.props.name]: (this.state.value||"").trim(), 
                    [this.props.confirm_name]: (this.state.confirm_value||"").trim()
                }, 
                {
                    [this.props.confirm_name]: this.props.validations[this.props.confirm_name]
                }
            ); 
            var validation_object = 
            {
                error: Boolean(validations)
            }; 
            return validation_object.error? 
            {
                ...validation_object, 
                helperText: this.ValidationHelperText(validations, "confirm_name") 
            }: validation_object
        }
    }
    render()
    {
        return (
            <React.Fragment>
                <TextInput {...this.props} ValueChange={(state)=>this.setState(state)} />
                <MaterialUI.TextField 
                    size="medium"
                    fullWidth
                    name={this.props.confirm_name}
                    label={this.props.confirm_title} 
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