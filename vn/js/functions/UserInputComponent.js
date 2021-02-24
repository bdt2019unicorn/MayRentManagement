class UserInputComponent extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
    }
    componentDidMount() 
    {
        console.log("test"); 
    }
    Methods = 
    {
        InnitialValue()
        {
            return this.props.edit_data? this.props.edit_data[this.props.name]: undefined; 
        }, 
        ValidationObject()
        {
            var this_validations = _.cloneDeep(this.props.validations); 
            if(!this_validations)
            {
                return undefined; 
            }
            else if(!this_validations[this.props.name])
            {
                return; 
            }
            else 
            {
                this_validations = _.cloneDeep(this_validations[this.props.name]); 
            }
            let required = this_validations.presence? true: false; 
            let validations = validate({[this.props.name]:this.state.value}, {[this.props.name]: this_validations}); 
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

class SimpleInputComponent extends UserInputComponent 
{
    constructor(props)
    {
        super(props); 
        this.state = {value: this.InnitialValue()}; 
    }
}