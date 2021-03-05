class DateInput extends UserInputComponent
{
    render() 
    {
        var value = this.state.value? moment(this.state.value): undefined; 
        var validation_object = this.ValidationObject(); 
        let error = _.get(validation_object, "error"); 
        var input_props = 
        {
            name: this.props.name, 
            className: "form-control width-full "+ (error? "border border-red": ""), 
            readOnly: true 
        }; 
        if(!value)
        {
            input_props["value"] = ""; 
        }
        var clear_button_style = 
        {
            width: "5%",
            position: "absolute",
            right: 0,
            top: error? "35%": "50%"
        }; 
        return (
            <UserInputFormControl title={this.props.title} {...validation_object}>
                <ReactDatetime
                    className="width-full mt-1"
                    value={value}
                    onChange={value=>this.setState({value})}
                    closeOnSelect={true}
                    dateFormat="DD/MM/yyyy"
                    timeFormat={false}
                    inputProps={input_props}
                />
                <MaterialUI.IconButton 
                    size="small" 
                    className="mr-3"
                    style={clear_button_style}
                    onClick={()=>this.setState({value: undefined})}
                >
                    <MaterialUI.Icon fontSize="small">clear</MaterialUI.Icon>
                </MaterialUI.IconButton>
            </UserInputFormControl>

        ); 
    }
}