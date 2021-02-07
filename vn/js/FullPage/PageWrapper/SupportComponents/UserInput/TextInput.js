class TextInput extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
    }
    render() 
    {
        let required = this.props.validations? true: false; 
        let error = !(required || this.props.value); 
        return (

            <MaterialUI.TextField 
                size="medium"
                fullWidth
                name={this.props.name}
                label={this.props.title} 
                // value={this.state.value} 
                type={this.props.type} 
                margin="normal"
                variant="outlined"
                required={required}
                // error={true}
            />
        );
    }
}