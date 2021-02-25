class NumberInput extends SimpleInputComponent
{
    render() 
    {
        var ValueChange = value =>
        {
            console.log(value); 
        }; 
        return (
            <NumberFormat thousandSeparator={true} onValueChange={ValueChange} />
        );
    }
}