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
            let validation = validate(data, this.props.form.validate.rules); 
            if(!validation)
            {
                if(this.props.form.validate.eliminate)
                {
                    Object.values(this.props.form.validate.eliminate).forEach(key=>delete data[key]); 
                }
                Emitter.emit("formSubmitValid", data); 
            }
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
                        try {
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
                                    validations = {this.props.form.validate.rules}
                                    edit_data = {this.props.edit_data}
                                />
                            </MaterialUI.Grid>); 
                        }
                        catch(exception){console.log(exception); return <div key={Math.random().toExponential(10).toString()}>test</div>;}
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