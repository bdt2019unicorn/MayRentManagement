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
                this.props.FormSubmitValid(data); 
            }
        } 
    }
    render() 
    {
        if(!this.props.form)
        {
            return null; 
        }
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
                        if(!ComponentClass)
                        {
                            return (
                                <div key={Math.random().toExponential(12).toString()}>{component.component}</div>
                            ); 
                        }
                        let name = component.name; 
                        return (
                            <MaterialUI.Grid
                                className="p-2"
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
                        catch(exception){console.log(exception); console.log("not exist"); return <div key={Math.random().toExponential(10).toString()}>test</div>;}
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
                        <SubmitButton 
                            class="float-left" 
                            icon="clear" 
                            SubmitButtonClick={this.props.ClearButton}
                            title="Xóa"
                            type="reset" 
                        />
                    </form>
                </MaterialUI.Container>
            </MaterialUI.Grid>
        );
    }
}