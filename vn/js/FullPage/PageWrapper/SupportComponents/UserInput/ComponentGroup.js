class DateGroup extends UserInputComponent
{
    render() 
    {
        var Grid = MaterialUI.Grid; 
        var DateInputProps= (group)=>
        (
            {
                ...this.props.date_data[group], 
                edit_data: this.props.edit_data, 
                validations: this.props.validations,  
                compare: this.state.value, 
                ValueStateChange: ()=> this.setState
                (
                    {
                        value: (this.state.value || 1) + 1 
                    }
                )
            }
        ); 

        return (
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <DateInput {...DateInputProps("small_date")} />
                </Grid>
                <Grid item xs={6}>
                    <DateInput {...DateInputProps("big_date")} />
                </Grid>
            </Grid>
        );
    }
}