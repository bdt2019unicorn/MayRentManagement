class Add extends AddEditComponent
{
    constructor(props)
    {
        super(props); 
        this.Methods = {...this.Methods, ...AddEditComponent.Methods}; 
        BindFunctions(this); 
        this.InnitialState(); 
    }
    CustomEvents = 
    {
        "formSubmitValid": (data)=> 
        {
            console.log(data); 
            let url = ""; 
            console.log(this.state); 
            console.log(this.props); 
        }
    }
}