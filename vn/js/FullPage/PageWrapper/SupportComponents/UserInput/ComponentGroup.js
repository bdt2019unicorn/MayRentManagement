class ComponentGroup extends UserInputComponent
{
    render()
    {
        var {component_data, edit_data, lock} = this.props; 
        var Grid = MaterialUI.Grid; 
        var grid_xs = 12/component_data.length; 
        return (
            <Grid container spacing={1}>
                {
                    component_data.map
                    (
                        (component, index) =>
                        {
                            var Component = window[component.component]; 
                            return (
                                <Grid key={index} item xs={grid_xs}>
                                    <Component
                                        {...component}
                                        edit_data={edit_data}
                                        lock={lock?lock.includes(component.name):undefined}
                                    />
                                </Grid>
                            ); 
                        }
                    )
                }
            </Grid>
        ); 
    }
}

class DateGroup extends UserInputComponent
{
    constructor(props)
    {
        super(props); 
        this.state.value = 1; 
    }
    DateInputProps = (group) =>
    (
        {
            ...this.props.date_data[group], 
            edit_data: this.props.edit_data, 
            validations: this.props.validations,  
            compare: this.state.value, 
            ValueStateChange: ()=> this.setState({value: this.state.value+1})
        } 
    )
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