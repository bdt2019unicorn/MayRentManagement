class NumberInput extends UserInputComponent
{
    render() 
    {
        var validation_object; 
        try {
        validation_object = this.ValidationObject(); 
        console.log(validation_object); 
        }catch (exception){console.log(exception); }
        var error = _.get(validation_object, "error"); 
        return (
            <MaterialUI.FormControl fullWidth error={error}>
                <label className={error?"text-red": undefined}>{this.props.title+(_.get(validation_object, "required")?" *": "")}</label>
                <NumberFormat 
                    className={`form-control mt-1 ${error?"border-red": ""}`}
                    thousandSeparator={true} 
                    name={this.props.name}
                    value={this.state.value}
                    onValueChange={({value}) => this.setState({value})}
                />
                {
                    error && 
                    <MaterialUI.FormHelperText>{_.get(validation_object, "helperText")}</MaterialUI.FormHelperText>
                }
            </MaterialUI.FormControl>
            
        );
    }
}