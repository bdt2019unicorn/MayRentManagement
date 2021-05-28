class UserInput extends BaseComponent
{
    FormSubmit = (event) =>
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
                        var ComponentClass = window[component.component]; 
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
                                    match = {this.props.match}
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
                        <ActionButton 
                            class="float-left" 
                            icon="clear" 
                            ActionButtonClick={this.props.ClearButton}
                            title="Xóa"
                            type="reset" 
                        />
                    </form>
                </MaterialUI.Container>
            </MaterialUI.Grid>
        );
    }
}