class NumberInput extends UserInputComponent
{
    render() 
    {
        let validation_object = this.ValidationObject(); 
        return (
            <UserInputFormControl 
                {...validation_object}
                title={this.props.title}
            >
                <NumberFormat 
                    className={`form-control mt-1 ${_.get(validation_object, "error")?"border-red": ""}`}
                    thousandSeparator={true} 
                    value={this.state.value}
                    onValueChange={({value}) => this.setState({value}, ()=>this.ExecPropsFunction("ValueChange", { ...this.props, value}))}
                />
                <input hidden readOnly value={this.state.value || ""} name={this.props.name} />
            </UserInputFormControl>
        ); 
    }
}