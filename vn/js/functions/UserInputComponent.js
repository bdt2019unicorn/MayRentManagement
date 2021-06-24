class UserInputComponent extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        this.state = {value: this.InnitialValue()}; 
    }
    componentDidUpdate(previous_props, previous_state)
    {
        if(!_.isEqual(this.props.value, previous_props.value))
        {
            this.setState({value: this.props.value}); 
        }
        else if(!_.isEqual(this.props.edit_data, previous_props.edit_data))
        {
            this.setState({value: this.props.edit_data[this.props.name]}); 
        }
    }
    InnitialValue = () =>
    {
        if(this.props.value)
        {
            return this.props.value; 
        }
        else if(this.props.edit_data) 
        {
            return this.props.edit_data[this.props.name]; 
        }
        return undefined; 
    }
    SimpleInputOnChange = (event) =>
    {
        let state = {value: event.target.value}; 
        this.setState(state); 
        this.ExecPropsFunction("ValueChange", state); 
    }
    ThisValidations = () =>
    {   
        var this_validations = _.cloneDeep(this.props.validations); 
        if(!this_validations)
        {
            return undefined; 
        }
        else if(!this_validations[this.props.name])
        {
            return undefined; 
        }
        else 
        {
            this_validations = _.cloneDeep(this_validations[this.props.name]); 
        }
        return this_validations; 
    }
    ThisValidationsRequired = (this_validations) => Boolean(_.get(this_validations, "presence"))
    ValidationAction = (this_validations) => validate({[this.props.name]:this.state.value}, {[this.props.name]: this_validations})
    ValidationObject = (this_validations) =>
    {
        this_validations = this_validations || this.ThisValidations(); 
        if(!this_validations)
        {
            return undefined; 
        }
        let required = this.ThisValidationsRequired(this_validations); 
        let validations = this.ValidationAction(this_validations); 
        var validation_object = 
        {
            required, 
            error: Boolean(validations)
        }; 
        return validation_object.error? 
        {
            ...validation_object, 
            helperText: this.ValidationHelperText(validations, "name") 
        }: validation_object
    }   
}

class UserInputFormControl extends React.Component
{
    render() 
    {
        return (
            <MaterialUI.FormControl className={`m-2 ${this.props.lock?"lock-element":""}`} fullWidth error={this.props.error}>
                <label className={this.props.error?"text-red": undefined}>{this.props.title+(this.props.required?" *": "")}</label>
                {this.props.children}
                {
                    this.props.error && <MaterialUI.FormHelperText>{this.props.helperText}</MaterialUI.FormHelperText>
                }
            </MaterialUI.FormControl>         
        );
    }
}

class SelectInputFormControl extends React.Component
{
    render() 
    {
        var error = _.get(this.props.validation_object, "error"); 
        return (
            <MaterialUI.FormControl fullWidth className="m-3" error={error} disabled={this.props.disabled}>
                <MaterialUI.InputLabel>{this.props.title + ((_.get(this.props.validation_object, "required")?" *": ""))}</MaterialUI.InputLabel>
                {this.props.children}
                {
                    error && <MaterialUI.FormHelperText>{_.get(this.props.validation_object, "helperText")}</MaterialUI.FormHelperText>
                } 
            </MaterialUI.FormControl>
        );
    }
}

class SelectComponent extends UserInputComponent
{
    constructor(props)
    {
        super(props); 
        this.state = {...this.state, options: this.PopulateSelectData()}; 
        this.state.value = this.state.value || ""; 
    }
    PopulateSelectData = () =>
    {
        var select_data = this.props.select_data || this.TableData(this.props.overview_controller, {edit: 1});
        return select_data.map
        (
            option=>
            (
                {
                    value: typeof(option)=="object"? option[this.props.select_value]: option, 
                    text: typeof(option)=="object"? option[this.props.text]: option
                }
            )
        ); 
    }
}