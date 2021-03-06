class DateGroup extends UserInputComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.state.value = 1; 
    }
    Methods = 
    {
        DateInputProps(group)
        {
            return {
                ...this.props.date_data[group], 
                edit_data: this.props.edit_data, 
                validations: this.props.validations,  
                compare: this.state.value, 
                ValueStateChange: ()=> this.setState({value: this.state.value+1})
            }; 
        }
    }
    render() 
    {
        var Grid = MaterialUI.Grid; 
        return (
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <DateInput {...this.DateInputProps("small_date")} />
                </Grid>
                <Grid item xs={6}>
                    <DateInput {...this.DateInputProps("big_date")} />
                </Grid>
            </Grid>
        );
    }
}