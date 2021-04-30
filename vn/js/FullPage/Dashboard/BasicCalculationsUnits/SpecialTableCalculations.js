class SwitchFormValue extends React.Component 
{
    constructor(props)
    {
        super(props); 
        this.state = {checked: Boolean(this.props.checked)}; 
        this.check_box_ref = React.createRef(); 
    }
    render()
    {
        return (
            <React.Fragment>
                <MaterialUI.FormControlLabel 
                    label={this.props.label}
                    control=
                    {
                        <MaterialUI.Switch 
                            checked={this.state.checked} 
                            onChange={event=>this.setState({checked: event.target.checked})} 
                        />
                    }
                />
                <input hidden name={this.props.name} ref={this.check_box_ref} defaultValue={this.props.checked} />
            </React.Fragment>

        ); 
    }
}

class RevenueTypeCalculation extends React.Component 
{
    render()
    {
        return (
            <MaterialUI.FormGroup row>
                <SwitchFormValue label="Là đơn vị tiện ích" checked={Number(_.get(this.props.edit_data, "is_utility")) || 0} />
            </MaterialUI.FormGroup>
        ); 
    }
}

class LeaseagrmPeriodCalculation extends React.Component 
{
    render()
    {
        return (
            <div>
                LeaseagrmPeriodCalculation
            </div>
        ); 
    }
}