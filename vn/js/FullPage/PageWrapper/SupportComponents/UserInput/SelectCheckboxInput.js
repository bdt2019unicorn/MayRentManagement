class SelectInput extends SelectComponent
{
    render() {
        var validation_object = this.ValidationObject(); 
        return (
            <SelectInputFormControl validation_object={validation_object} title={this.props.title || ""} disabled={this.props.disabled}>
                <MaterialUI.NativeSelect 
                    value={this.state.value}
                    inputProps={{name: this.props.name}}
                    onChange={this.SimpleInputOnChange}
                >
                    <option value="" />
                    {
                        this.state.options.map(({value, text})=><option key={value} value={value}>{text}</option>)
                    }
                </MaterialUI.NativeSelect>
            </SelectInputFormControl>
        );
    }
}

class MultiSelectValue extends SelectComponent
{
    componentDidUpdate(previous_props, previous_state)
    {
        if(this.state.value==previous_state.value)
        {
            return; 
        }
        var value = JSON.parse(this.state.value); 
        this.ExecPropsFunction("SelectValueChanged", value); 
    }
    render() 
    {
        return (
            <UserInputFormControl title={this.props.title}>
                <ReactWidgets.Multiselect 
                    {...this.props.select_atributes} 
                    data={this.state.options} 
                    value={JSON.parse(this.state.value||"[]").map(value=>value.toString())}
                    onChange=
                    {
                        (options)=> this.setState
                        (
                            {
                                value: JSON.stringify
                                ( 
                                    options.map
                                    ( 
                                        ({value}) => Number(value) 
                                    ) 
                                )
                            }
                        ) 
                    }
                />
                <ClearButton ClearButtonClick={()=>this.setState({value: "[]"})} />
                <input type="hidden" name={this.props.name} value={this.state.value || ""} />
            </UserInputFormControl>
        ); 
    }
}

class CheckboxInput extends UserInputComponent
{
    render() 
    {
        return (
            <React.Fragment>
                <MaterialUI.FormControlLabel 
                    label={this.props.title}
                    control=
                    {
                        <MaterialUI.Checkbox 
                            checked={Boolean(this.state.value)}
                            onChange={event=>this.setState({value: event.target.checked})}
                        />
                    }
                />
                <input type="hidden" name={this.props.name} value={Number(Boolean(this.state.value))} />
            </React.Fragment>
        );
    }
}