class NumberInput extends SimpleInputComponent
{
    render() 
    {
        // var Change = event =>
        // {
        //     let value = event.target.value; 
        //     let state = {value}; 
        //     this.setState(state); 
        //     Emitter.emit("valueChange", state); 
        // }; 
        return (
            <NumberFormat thousandSeparator={true} />
        );
    }
}