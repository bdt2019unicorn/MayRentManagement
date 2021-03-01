class SelectInput extends UserInputComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.state = {...this.state, options: this.PopulateSelectData()}; 
    }
    Methods =
    {
        PopulateSelectData()
        {
            var select_data = this.props.select_data || this.TableData(this.props.overview_controller, {edit: 1});
            return select_data.map
            (
                option=>
                (
                    {
                        value: option[this.props.select_value], 
                        text: option[this.props.text]
                    }
                )
            ); 
        }
    }
    render() {
        return (
            <MaterialUI.FormControl fullWidth className="m-3">
                <MaterialUI.InputLabel htmlFor={this.props.name}>{this.props.title}</MaterialUI.InputLabel>
                <MaterialUI.NativeSelect 
                    value={this.state.value}
                    inputProps={{name: this.props.name, id: this.props.name}}
                    onChange={this.SimpleInputOnChange}
                >
                    <option value="" />
                    {
                        this.state.options.map(({value, text})=><option key={value} value={value}>{text}</option>)
                    }
                </MaterialUI.NativeSelect>
            </MaterialUI.FormControl>
        );
    }
}



class CheckboxInput extends UserInputComponent
{
    render() 
    {
        return (
            <MaterialUI.FormControlLabel 
                label={this.props.title}
                control=
                {
                    <MaterialUI.Checkbox 
                        name={this.props.name}
                        checked={Boolean(this.state.value)}
                        onChange={event=>this.setState({value: event.target.checked})}
                    />
                }
            />
        );
    }
}