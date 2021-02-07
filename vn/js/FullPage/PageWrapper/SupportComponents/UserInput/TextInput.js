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
        }
    }
    render() 
    {
        let required = this.props.validations? true: false; 
        let error = !(!required || this.state.value); 
        let value = this.InnitialValue(); 
        let helper_text = error?"Please fill out this field": undefined; 
        return (
            <MaterialUI.TextField 
                size="medium"
                fullWidth
                name={this.props.name}
                label={this.props.title} 
                value={value} 
                type={this.props.type} 
                margin="normal"
                variant="outlined"
                required={required}
                error={error}
                onChange={(event)=>this.setState({value: event.target.value})}
                helperText={helper_text}
            />
        );
    }
}