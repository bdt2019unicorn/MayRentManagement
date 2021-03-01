class NumberInput extends SimpleInputComponent
{
    render() 
    {
        return (
            <MaterialUI.FormControl fullWidth>
                <label>{this.props.title}</label>
                <NumberFormat 
                    thousandSeparator={true} 
                    name={this.props.name}
                    onValueChange=
                    {
                        value => 
                        {
                            console.log(value); 
                        }
                    } 
                />
            </MaterialUI.FormControl>
            
        );
    }
}