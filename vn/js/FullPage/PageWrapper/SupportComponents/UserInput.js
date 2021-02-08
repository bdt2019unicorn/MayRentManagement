class UserInput extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.state = {validation_rules: this.ValidationRules()}; 
    }
    Methods =  
    {
        FormSubmit(event)
        {
            event.preventDefault(); 
            var form_data = new FormData(event.target); 
            var data = Object.fromEntries(form_data); 
            console.log(data); 
            let validation = validate(data, this.state.validation_rules); 
            console.log(validation); 
        }, 
        ValidationRules()
        {
            var rules = _.cloneDeep(this.props.form.validate.rules); 
            return Object.keys(rules).reduce
            (
                (accumulator, current_value)=>
                {
                    let value = rules[current_value]; 
                    if(typeof(value) === "string")
                    {
                        switch (value) 
                        {
                            case "required":
                                return {
                                    ...accumulator, 
                                    [current_value]: {presence: true}
                                }; 
                            default:
                                return accumulator
                        }
                    }
                    else 
                    {
                        var validation = Object.keys(value).reduce
                        (
                            (accumulator, current_value)=>
                            {
                                var new_rule; 
                                switch (current_value) 
                                {
                                    case "required":
                                        new_rule = {presence: value[current_value]}; 
                                        break;
                                    case "equalTo": 
                                        new_rule = {equality: value[current_value].replaceAll("#", "").trim()}
                                        break; 
                                    default:
                                        new_rule = {[current_value]: value[current_value]}; 
                                        break;
                                }
                                return {
                                    ...accumulator, 
                                    ...new_rule
                                }; 
                            }, {}
                        ); 
                        return {...accumulator, [current_value]:validation}; 
                    }
                }, {}
            ); 
        }
    }
    render() 
    {
        let form = this.props.form.form.map
        (
            components=> 
            {
                var columns = components.map
                (
                    component =>  
                    {
                        let type = component.component.split("-").map(string => string.charAt(0).toUpperCase() + string.slice(1)).join(""); 
                        var ComponentClass = window[type]; 
                        let name = component.name; 
                        return (
                            <MaterialUI.Grid
                                item
                                xs={12}
                                md={12/(components.length)}
                                key={btoa(JSON.stringify(component)) + Math.random()}
                            >
                                <ComponentClass 
                                    {...component} 
                                    key={name} 
                                    validations={this.state.validation_rules[name]} 
                                />
                            </MaterialUI.Grid>); 
                    }
                ); 
                return (
                    <MaterialUI.Grid key={btoa(JSON.stringify(components)) + Math.random()} container spacing={1}>
                        {columns}
                    </MaterialUI.Grid>
                ); 
            }
        ); 
        return (
            <MaterialUI.Grid container alignItems="center" justify="center">
                <MaterialUI.Container maxWidth="sm" fixed className="border border-blue-light p-4 m-4">
                    <h1 className="text-center">{this.props.form.title}</h1>
                    <form onSubmit={this.FormSubmit}>
                        {form}
                        <SubmitButton />
                    </form>
                </MaterialUI.Container>
            </MaterialUI.Grid>
        );
    }
}