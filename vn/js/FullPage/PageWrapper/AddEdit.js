class Add extends AddEditComponent
{
    constructor(props)
    {
        super(props); 
        this.Methods = {...this.Methods, ...AddEditComponent.Methods}; 
        BindFunctions(this); 
        this.InnitialState(); 
    }
}