class UserInput extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
    }
    CustomEvents = 
    {
    }
    Methods =  
    {
        Test(event)
        {
            console.log(event.target.value); 
        }
    }
    render() 
    {
        var Formsy = FormsyReact.default; 
        var withFormsy = FormsyReact.withFormsy; 
        let form = this.props.form.form.map
        (
            components=> 
            {
                var columns = components.map
                (
                    component =>  
                    {
                        let type = component.component.split("-").map(string => string.charAt(0).toUpperCase() + string.slice(1)).join(""); 
                        var ComponentClass = withFormsy(window[type]); 
                        let validations = this.props.form.validate[component.name]; 
                        if(validations)
                        {
                            if(validations instanceof String)
                            {
                                switch (validations) 
                                {
                                    case "required":
                                        validations = {required: true, validationError: "test error required"}; 
                                        break;
                                    default:
                                        break;
                                }
                            }
                            else 
                            {

                            }
                        }
                        return (
                            <MaterialUI.Grid
                                item
                                xs={12}
                                md={12/(components.length)}
                                key={btoa(JSON.stringify(component)) + Math.random()}
                            >
                                <ComponentClass {...component} key={component.name} name={component.name} {...validations} />
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
                    {/* <Formsy onValid={()=>valid_p="currently_valid"} onInvalid={()=>valid_p="not valid"}> */}
                    <Formsy onValid={()=>console.log("valid formsy")} onInvalid={()=>console.log("not valid formsy")}>
                        {form}
                        <SubmitButton />
                    </Formsy>
                </MaterialUI.Container>
            </MaterialUI.Grid>
        );
    }
}