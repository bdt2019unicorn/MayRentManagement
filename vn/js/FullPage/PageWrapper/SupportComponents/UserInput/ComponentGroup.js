class DateGroup extends UserInputComponent
{
    render() 
    {
        var Grid = MaterialUI.Grid; 
        return (
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <DateInput 
                        {...this.props.date_data.small_date} 
                        edit_data={this.props.edit_data} 
                        validations={this.props.validations} 
                    />
                </Grid>
                <Grid item xs={6}>
                    <DateInput 
                        {...this.props.date_data.big_date} 
                        edit_data={this.props.edit_data} 
                        validations={this.props.validations} 
                    />
                </Grid>
            </Grid>
        );
    }
}