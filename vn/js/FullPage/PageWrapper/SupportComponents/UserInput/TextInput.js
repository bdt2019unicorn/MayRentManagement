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
        const errorMessage = this.props.errorMessage;
        return (
            <React.Fragment>
                <MaterialUI.TextField 
                    size="medium"
                    fullWidth
                    name={this.props.name}
                    label={this.props.title} 
                    value={this.props.value} 
                    type={this.props.type} 
                    margin="normal"
                    variant="outlined"
                />
                <span>{errorMessage}</span>
            </React.Fragment>
        );
    }
}