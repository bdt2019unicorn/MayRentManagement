class NumberInput extends UserInputComponent
{
    render() 
    {
        try {
        var validation_object = this.ValidationObject(); 
        console.log(validation_object); 
        }catch (exception){console.log(exception); }
        return (
            <MaterialUI.FormControl fullWidth error>
                <label>{this.props.title}</label>
                <NumberFormat 
                    className="form-control"
                    thousandSeparator={true} 
                    name={this.props.name}
                    value={this.state.value}
                    onValueChange={({value}) => this.setState({value})}
                />
            </MaterialUI.FormControl>
            
        );
    }
}