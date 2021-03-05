class NumberInput extends UserInputComponent
{
    render() 
    {
        ValidationWork: 
        {
            let this_validations = this.ThisValidations(); 
            var error, required, helper_text; 
            if(!this_validations)
            {
                break ValidationWork; 
            }
            required = this.ThisValidationsRequired(this_validations); 
            let validations, numericality, numericality_keys; 

            if(this_validations.numericality)
            {
                numericality_keys = Object.keys(this_validations.numericality); 
                if(!numericality_keys.includes("message"))
                {
                    numericality = _.cloneDeep(this_validations.numericality); 
                    delete this_validations.numericality; 
                }
            }

            validations = this.ValidationObject(this_validations); 
            error = _.get(validations, "error"); 
            if(error)
            {
                helper_text = _.get(validations, "helperText"); 
            }
            else if(numericality)
            {
                for (let key of numericality_keys) 
                {
                    let rules = numericality[key]; 
                    let rules_string = typeof(rules)=="string"; 
                    let result = this.ValidationAction
                    ( 
                        {
                            numericality: 
                            {
                                [key]: rules_string? true : _.get(rules, "attribute")
                            }
                        }
                    ); 
                    if(Boolean(result))
                    {
                        error = true; 
                        helper_text = rules_string? rules: _.get(rules, "message"); 
                        break ValidationWork; 
                    }
                }
            }
        }
        return (
            <UserInputFormControl 
                error={error} 
                required={required} 
                helper_text={helper_text} 
                title={this.props.title}
            >
                <NumberFormat 
                    className={`form-control mt-1 ${error?"border-red": ""}`}
                    thousandSeparator={true} 
                    name={this.props.name}
                    value={this.state.value}
                    onValueChange={({value}) => this.setState({value})}
                />
            </UserInputFormControl>
        ); 
    }
}