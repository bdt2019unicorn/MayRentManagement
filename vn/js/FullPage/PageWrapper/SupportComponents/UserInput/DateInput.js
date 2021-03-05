class DateInput extends UserInputComponent
{
    render() 
    {
        var value = this.state.value? moment(this.state.value): undefined; 
        return (
            <UserInputFormControl title={this.props.title}>
                <ReactDatetime
                    className="width-full"
                    value={value}
                    onChange={value=>this.setState({value})}
                    closeOnSelect={true}
                    dateFormat="DD/MM/yyyy"
                    timeFormat={false}
                    inputProps=
                    {
                        {
                            name: this.props.name, 
                            className: "form-control width-full"
                        }
                    }
                />
            </UserInputFormControl>

        ); 
    }
}