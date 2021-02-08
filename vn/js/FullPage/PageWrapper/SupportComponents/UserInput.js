class UserInput extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
    }
    Methods =  
    {
        FormSubmit(event)
        {
            event.preventDefault(); 
            var form_data = new FormData(event.target); 
            var data = Object.fromEntries(form_data); 
            console.log(data); 
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
                                console.log(value); 
                                return accumulator
                        }
                    }
                    else 
                    {
                        console.log(value);
                        console.log(typeof(value)); 
                        return accumulator; 
                    }
                }, {}
            ); 
        }
    }
    render() 
    {
        let validation_rules = this.ValidationRules(); 
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
                                    validations={validation_rules[name]} 
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