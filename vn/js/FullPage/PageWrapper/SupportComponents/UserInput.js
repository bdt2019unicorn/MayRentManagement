class UserInput extends React.Component  
{
    constructor(props)
    {
        super(props); 
        BindFucntions(this); 
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
                                <ComponentClass {...component} key={component.name} />
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
            <MaterialUI.Container maxWidth="md" className="border border-indigo-600 border-opacity-75 p-4">
                <h1 className="text-center text-3xl">{this.props.form.title}</h1>
                {form}
            </MaterialUI.Container>
        );
    }
}