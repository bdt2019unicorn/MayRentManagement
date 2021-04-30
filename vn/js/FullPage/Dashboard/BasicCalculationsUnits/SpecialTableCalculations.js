class SwitchFormValue extends React.Component 
{
    constructor(props)
    {
        super(props); 
        this.state = {checked: false}; 
        this.input_ref = React.createRef(); 
    }
    componentDidUpdate(previous_props, previous_state)
    {
        if(!_.isEqual(this.props.checked, previous_props.checked))
        {
            var checked = Boolean(this.props.checked); 
            this.input_ref.current.value = Number(checked); 
            this.setState({checked}); 
        }
    }
    render()
    {
        return (
            <div className={this.props.lock?"lock-element" : undefined}>
                <MaterialUI.FormControlLabel 
                    label={this.props.label}
                    control=
                    {
                        <MaterialUI.Switch 
                            checked={this.state.checked} 
                            onChange=
                            {
                                event=>
                                {
                                    this.setState({checked: event.target.checked}); 
                                    this.input_ref.current.value = Number(event.target.checked); 
                                } 
                            }
                        />
                    }
                />
                <input hidden ref={this.input_ref} name={this.props.name} defaultValue="0" />
            </div>
        ); 
    }
}

class RevenueTypeCalculation extends React.Component 
{
    render()
    {
        return (
            <MaterialUI.FormGroup row>
                <SwitchFormValue 
                    name="is_utility"
                    label="Là đơn vị tiện ích" 
                    checked={Number(_.get(this.props.edit_data, "is_utility"))}
                />
            </MaterialUI.FormGroup>
        ); 
    }
}

class LeaseagrmPeriodCalculation extends React.Component 
{
    render()
    {
        return (
            <div className="d-flex flex-justify-between">
                <div className="w-80">
                </div>
                <SwitchFormValue  
                    name="is_basic"
                    label="Là đơn vị tính cơ bản"
                    checked={Number(_.get(this.props.edit_data, "is_basic"))}
                    lock={true}
                />
            </div>
        ); 
    }
}