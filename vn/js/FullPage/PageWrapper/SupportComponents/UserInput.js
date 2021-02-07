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
                                    validations={this.props.form.validate.rules[name]} 
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