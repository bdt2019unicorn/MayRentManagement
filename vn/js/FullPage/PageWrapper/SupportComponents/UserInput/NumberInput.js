class NumberInput extends UserInputComponent
{
    render() 
    {
        return (
            <MaterialUI.FormControl fullWidth>
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