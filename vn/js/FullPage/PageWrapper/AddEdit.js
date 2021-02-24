class Add extends AddEditComponent
{
    CustomEvents = 
    {
        "formSubmitValid": (data)=> 
        {
            let result = SubmitData("excel", this.ImportUrl(), [data]); 
            if(Number(result))
            {
                alert(`${this.state.form.title} thành công!`); 
                if(this.props.AuthorizeSuccess)
                {
                    this.props.AuthorizeSuccess(data, Number(result)); 
                }
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
        BindFunctions(this); 
        this.state = {...this.state, edit_data: this.PopulateDataIntoFields()}; 
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
            form.title = this.props.form_title || form.title; 
            this.state.form = form; 
        }, 
        PopulateDataIntoFields()
        {
            let data = this.TableData(this.CurrentController(), {id: this.ObjectId(), edit: 1}); 
            return data[0]; 
        }
    }
    CustomEvents = 
    {
        "formSubmitValid": (data)=> 
        {
            let controller = this.CurrentController(); 
            var url = `../server/database_controller/edit.php?table=${controller}&id=${this.ObjectId()}`; 
            var result = SubmitData("edit",url,data); 
            
            if(Number(result))
            {
                alert("Edit Information success"); 
                if(controller=="buildings")
                {
                    Emitter.emit("editBuildingSuccess"); 
                }
                this.ReloadUserInput(()=>this.setState({edit_data: this.PopulateDataIntoFields()})); 
            }
            else
            {
                alert("Edit Information fails"); 
            }
        }
    }
}