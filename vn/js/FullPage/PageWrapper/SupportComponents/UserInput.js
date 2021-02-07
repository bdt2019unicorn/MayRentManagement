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
                        return (
                            <MaterialUI.Grid
                                item
                                xs={12}
                                md={12/(components.length)}
                                key={btoa(JSON.stringify(component)) + Math.random()}
                            >
                                <ComponentClass 
                                    {...component} 
                                    key={component.name} 
                                    validations={this.props.form.validate.rules[component.name]} 
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
                    <form>
                        {form}
                        <SubmitButton />
                    </form>
                </MaterialUI.Container>
            </MaterialUI.Grid>
        );
    }
}