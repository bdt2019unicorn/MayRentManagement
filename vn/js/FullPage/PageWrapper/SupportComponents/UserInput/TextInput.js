class TextInput extends React.Component
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
    }
    Methods =  
    {
    }
    render() 
    {
        let required = this.props.validations? true: false; 
        console.log(required); 
        return (
            <MaterialUI.TextField 
                size="medium"
                fullWidth
                name={this.props.name}
                label={this.props.title} 
                value={this.props.value} 
                type={this.props.type} 
                margin="normal"
                variant="outlined"
                required={required}
            />
        );
    }
}