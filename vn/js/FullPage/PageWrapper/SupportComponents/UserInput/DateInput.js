class DateInput extends UserInputComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
    }
    Methods =
    {
        ValueStateChange(value = undefined)
        {
            this.setState({value}); 
            if(this.props.ValueStateChange)
            {
                this.props.ValueStateChange(); 
            }
        }
    }
    componentDidUpdate(previous_props, previous_state)
    {
        if(this.props.compare!=previous_props.compare)
        {
            this.ResetStateValue
            (
                {
                    value_name: "value", 
                    new_value: this.state.value? moment(this.state.value): undefined  
                }
            ); 
        }
    }
    render() 
    {
        var value = this.state.value? moment(this.state.value): undefined; 
        var validation_object = this.ValidationObject(); 
        let error = _.get(validation_object, "error"); 
        var input_props = 
        {
            id: this.props.name, 
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
                    onChange={this.ValueStateChange}
                    closeOnSelect={true}
                    dateFormat="DD/MM/yyyy"
                    timeFormat={false}
                    inputProps={input_props}
                />
                <MaterialUI.IconButton 
                    size="small" 
                    className="mr-3"
                    style={clear_button_style}
                    onClick={()=>this.ValueStateChange()}
                >
                    <MaterialUI.Icon fontSize="small">clear</MaterialUI.Icon>
                </MaterialUI.IconButton>
            </UserInputFormControl>

        ); 
    }
}