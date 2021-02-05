class TextInput extends React.Component 
{
    constructor(props)
    {
        super(props); 
        BindFucntions(this); 
    }
    Methods =  
    {
        Test(event)
        {
            console.log(event.target.value); 
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
                value={this.props.value} 
                type={this.props.type} 
                margin="normal"
                variant="outlined"
                onChange={this.Test} />
        );
    }
}