class NumberInput extends SimpleInputComponent
{
    render() 
    {
        var NumberFormatComponent = 
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
        />; 
        return (
            <MaterialUI.FormControl>
                <label>{this.props.title}</label>
                <NumberFormat 
                    thousandSeparator={true} 
                    id={this.props.name}
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