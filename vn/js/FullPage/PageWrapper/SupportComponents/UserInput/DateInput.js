class DateInput extends UserInputComponent
{
    render() 
    {
        var value = this.state.value? moment(this.state.value): undefined; 
        var input_props = 
        {
            name: this.props.name, 
            className: "form-control width-full", 
            readOnly: true 
        }; 
        if(!value)
        {
            input_props["value"] = ""; 
        }
        var validation_object = this.ValidationObject(); 
        console.log(validation_object); 
        return (
            <UserInputFormControl title={this.props.title}>
                <ReactDatetime
                    className="width-full"
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
                    style=
                    {
                        {
                            width: "5%",
                            position: "absolute",
                            right: 0,
                            top: "50%"
                        }
                    }
                    onClick={()=>this.setState({value: undefined})}
                >
                    <MaterialUI.Icon fontSize="small">clear</MaterialUI.Icon>
                </MaterialUI.IconButton>
            </UserInputFormControl>

        ); 
    }
}