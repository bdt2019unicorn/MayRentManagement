class UserInputComponent extends BaseComponent
{
    static Methods = 
    {
        InnitialValue()
        {
            return this.props.edit_data? this.props.edit_data[this.props.name]: undefined; 
        }, 
        ValidationObject()
        {
            if(!this.props.validations)
            {
                return undefined; 
            }
            let required = this.props.validations.presence||false; 
            let validations = validate({[this.props.name]:this.state.value}, {[this.props.name]: this.props.validations}); 
            var validation_object = 
            {
                required, 
                error: Boolean(validations)
            }; 
            return validation_object.error? 
            {
                ...validation_object, 
                helperText: validations[this.props.name][0]
            }: validation_object
        }   
    }
}

class SimpleInputComponent extends UserInputComponent 
{
    constructor(props)
    {
        super(props); 
        this.Methods = {...this.Methods, ...UserInputComponent.Methods}; 
        BindFunctions(this); 
        this.state = {value: this.InnitialValue()}; 
    }
}