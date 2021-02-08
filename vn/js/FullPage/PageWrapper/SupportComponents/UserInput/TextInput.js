class TextInput extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.state = {value: this.InnitialValue()}; 
    }
    Methods = 
    {
        InnitialValue()
        {
            return this.props.edit_data? this.props.edit_data[this.props.name]: undefined; 
        }, 
        ValidationObject()
        {
            if(!this.props.validations)
            {
                return undefined; 
            }
            let required = this.props.validations.presence||false; 
            let validations = validate({[this.props.name]:this.state.value}, {[this.props.name]: this.props.validations}); 
            var validation_object = 
            {
                required, 
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
            <MaterialUI.TextField 
                size="medium"
                fullWidth
                name={this.props.name}
                label={this.props.title} 
                value={this.InnitialValue()} 
                type={this.props.type} 
                margin="normal"
                variant="outlined"
                onChange={(event)=>this.setState({value: event.target.value})}
                {...this.ValidationObject()}
            />
        );
    }
}