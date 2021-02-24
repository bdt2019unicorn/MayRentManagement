class NumberInput extends SimpleInputComponent
{
    render() 
    {
        var ValueChange = value =>
        {
            console.log(value); 
            // Emitter.emit("valueChange", state); 
        }; 
        return (
            <NumberFormat thousandSeparator={true} onValueChange={ValueChange} />
        );
    }
}