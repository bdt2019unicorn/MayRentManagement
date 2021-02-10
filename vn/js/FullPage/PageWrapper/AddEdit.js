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
            let result = SubmitData("excel", this.ImportUrl(), [data]); 
            if(Number(result))
            {
                alert(`${this.state.form.title} thành công!`); 
                Emitter.emit("authorizeSuccess", this.props.controller, data, Number(result)); 
            }
            else 
            {
                alert(`${this.state.form.title} thất bại! Vui lòng thử lại`); 
            }
        }
    }
}