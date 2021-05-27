class SwitchFormValue extends React.Component 
{
    constructor(props)
    {
        super(props); 
        this.state = {checked: false}; 
    }
    componentDidUpdate(previous_props, previous_state)
    {
        if(!_.isEqual(this.props.checked, previous_props.checked))
        {
            var checked = Boolean(this.props.checked); 
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
                            onChange={event=>this.setState({checked: event.target.checked})}
                        />
                    }
                />
                <input hidden name={this.props.name} readOnly value={Number(this.state.checked)} />
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
    constructor(props)
    {
        super(props); 
        this.state = 
        {
            number: undefined, 
            operation: undefined, 
            operations: 
            [
                {value: "+", text: "cộng (+)"}, 
                {value: "-", text: "trừ (-)"}, 
                {value: "*", text: "nhân (x)"}, 
                {value: "/", text: "chia (:)"}
            ], 
            unit: undefined
        }; 
        if(this.props.edit_data)
        {
            if(Number(this.props.edit_data.is_basic))
            {
                return; 
            }
            var calculation_method = this.props.edit_data.calculation_method; 
            if(!calculation_method)
            {
                return; 
            }

            this.state = 
            {
                ...this.state, 
                unit: calculation_method.match('"\\w+"')[0].replaceAll('"', ''), 
                operation: calculation_method.match('\\)\\W')[0].replaceAll(')', ''), 
                number: calculation_method.match('\\d+')[0]
            }; 
        }
    }
    CalculationMethod = () => 
    {
        if(this.IsBasic() || !this.state.unit)
        {
            return ""; 
        }
        var number = this.state.operation?(this.state.number||0): undefined; 
        let script = `end_period.diff(start_period, "${this.state.unit}", true)${this.state.operation || ""}${number==undefined? "": number};`; 

        let {start_period, end_period} = this.TestPeriod(); 
        var test_result; 
        eval(`test_result = ${script}`); 
        if((test_result === Infinity) || !test_result) 
        {
            return ""; 
        }
        return script; 
    }
    IsBasic = () => 
    {
        let {start_period, end_period} = this.TestPeriod(); 
        var bad_diff = end_period.diff(start_period); 
        var current_diff = end_period.diff(start_period, this.props.edit_text, true); 
        return !(bad_diff==current_diff); 
    }
    TestPeriod = () => 
    (
        {
            start_period: moment(), 
            end_period: moment().add(1, "year")
        } 
    )
    render()
    {
        var Grid = MaterialUI.Grid; 
        var calculation_method = this.CalculationMethod(); 
        var basic_unit = this.IsBasic(); 
        return (
            <div className="d-flex flex-justify-between">
                <div className="w-80">
                    <Grid container spacing={1}>
                        <Grid item container xs={1} alignContent="center" alignItems="center">
                            <b>Khác biệt ở</b>
                        </Grid>
                        <Grid item xs={3}>
                            <SelectInput  
                                disabled={basic_unit}
                                select_data={this.props.basic_calculations.filter(({is_basic})=>Number(is_basic)).map(({name})=>name)}
                                value={this.state.unit}
                                ValueChange={({value})=>this.setState({unit: value})}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <SelectInput  
                                disabled={basic_unit}
                                select_data={this.state.operations}
                                select_value="value"
                                text="text"
                                value={this.state.operation}
                                ValueChange={({value})=>this.setState({operation: value})}
                            />
                        </Grid>
                        <Grid className="ml-6 mt-4" item container xs={4} alignContent="center" alignItems="center">
                            <NumberFormat 
                                className={`${basic_unit?"lock-element bg-gray": ""} width-full`}
                                thousandSeparator={true} 
                                value={this.state.number}
                                allowNegative={false}
                                onValueChange={({value}) => this.setState({number: value})}
                            />
                        </Grid>
                    </Grid>
                </div>
                <input hidden type="text" name="calculation_method" value={calculation_method} readOnly />
                <SwitchFormValue  
                    name="is_basic"
                    label="Là đơn vị tính cơ bản"
                    checked={basic_unit}
                    lock={true}
                />
            </div>
        ); 
    }
}