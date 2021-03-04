class DateInput extends UserInputComponent
{
    render() 
    {
        return <div>DateInput</div>; 
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