class UserInputComponent extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.state = {value: this.InnitialValue()}; 
    }
    Methods = 
    {
        InnitialValue()
        {
            return this.props.edit_data? this.props.edit_data[this.props.name]: undefined; 
        }, 
        SimpleInputOnChange(event)
        {
            let state = {value: event.target.value}; 
            this.setState(state); 
            if(this.props.ValueChange)
            {
                this.props.ValueChange(state); 
            }
        }, 
        ThisValidations()
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
        }, 
        ThisValidationsRequired(this_validations)
        {
            return Boolean(_.get(this_validations, "presence")); 
        }, 
        ValidationAction(this_validations)
        {
            return validate({[this.props.name]:this.state.value}, {[this.props.name]: this_validations}); 
        }, 
        ValidationObject(this_validations)
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
}

class UserInputFormControl extends React.Component
{
    render() 
    {
        return (
            <MaterialUI.FormControl className="m-2" fullWidth error={this.props.error}>
                <label className={this.props.error?"text-red": undefined}>{this.props.title+(this.props.required?" *": "")}</label>
                {this.props.children}
                {
                    this.props.error && <MaterialUI.FormHelperText>{this.props.helperText}</MaterialUI.FormHelperText>
                }
            </MaterialUI.FormControl>         
        );
    }
}