class DateInput extends UserInputComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.state.validation_object = this.ValidationObject(); 
    }
    Methods =
    {
        ValueStateChange(value = undefined)
        {
            this.setState({value}); 
            this.ExecPropsFunction("ValueStateChange"); 
        }
    }
    componentDidUpdate(previous_props, previous_state)
    {
        if
        ( 
            (previous_state.value==this.state.value) && 
            (previous_props.compare == this.props.compare) 
        )
        {
            return; 
        }
        this.setState({validation_object: this.ValidationObject()}); 
    }
    render() 
    {
        var value = this.state.value? moment(this.state.value): undefined; 
        let error = _.get(this.state.validation_object, "error"); 
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
        return (
            <UserInputFormControl title={this.props.title} {...this.state.validation_object}>
                <ReactDatetime
                    className="width-full mt-1"
                    value={value}
                    onChange={this.ValueStateChange}
                    closeOnSelect={true}
                    dateFormat="DD/MM/yyyy"
                    timeFormat={false}
                    inputProps={input_props}
                />
                <ClearButton 
                    error={error}  
                    ClearButtonClick={()=>this.ValueStateChange()}
                />
            </UserInputFormControl>

        ); 
    }
}