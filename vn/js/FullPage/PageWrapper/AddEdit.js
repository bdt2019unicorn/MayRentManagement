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

class Edit extends AddEditComponent
{
    constructor(props)
    {
        super(props); 
        this.Methods = {...this.Methods, ...AddEditComponent.Methods}; 
        BindFunctions(this); 
        this.InnitialState(); 
        this.state = {...this.state, edit_data: null}; 
        console.log(props); 
        console.log(this.state); 
        this.ModifyForm(); 
    }
    Methods = 
    {
        ModifyForm()
        {
            var form = _.cloneDeep(this.state.form); 
            for(var row of form.form)
            {
                for (let index = 0; index < row.length; index++) 
                {
                    if(row[index].component=="TextGroupConfirmation")
                    {
                        row[index].component = "TextInput"; 
                        delete form.validate.rules[row[index].confirm_name]; 
                    }
                    if(row[index].type=="password")
                    {
                        delete row[index].type; 
                    }
                }
            }
            this.state.form = form; 
        }
    }
    CustomEvents = 
    {
        "formSubmitValid": (data)=> 
        {
            // let result = SubmitData("excel", this.ImportUrl(), [data]); 
            // if(Number(result))
            // {
            //     alert(`${this.state.form.title} thành công!`); 
            //     Emitter.emit("authorizeSuccess", this.props.controller, data, Number(result)); 
            // }
            // else 
            // {
            //     alert(`${this.state.form.title} thất bại! Vui lòng thử lại`); 
            // }
        }
    }
}