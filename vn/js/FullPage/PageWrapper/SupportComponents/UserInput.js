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
            let validation = validate(data, this.props.form.validate); 
            console.log(validation); 
        }, 
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
                        var ComponentClass = window[component.component]; 
                        let name = component.name; 
                        return (
                            <MaterialUI.Grid
                                item
                                xs={12}
                                md={12/(components.length)}
                                key={encodeURIComponent(JSON.stringify(component)) + Math.random()}
                            >
                                <ComponentClass 
                                    {...component} 
                                    key={name} 
                                    validations = {this.props.form.validate}
                                />
                            </MaterialUI.Grid>); 
                    }
                ); 
                return (
                    <MaterialUI.Grid key={encodeURIComponent(JSON.stringify(components)) + Math.random()} container spacing={1}>
                        {columns}
                    </MaterialUI.Grid>
                ); 
            }
        ); 
        return (
            <MaterialUI.Grid container alignItems="center" justify="center">
                <MaterialUI.Container maxWidth={this.props.container_width||undefined} fixed className="border border-blue-light p-4 m-4">
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