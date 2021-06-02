class Add extends AddEditComponent
{
    FormSubmitValid = (data) => 
    {
        let result = SubmitData("excel", this.ImportUrl(), [data]); 
        if(Number(result))
        {
            alert(`${( this.props.AuthorizeSuccess?"": "Thêm " ) + this.state.form.title} thành công!`); 
            if(this.props.AuthorizeSuccess)
            {
                this.props.AuthorizeSuccess(data, Number(result)); 
            }
            else
            {
                this.Reset(); 
            }
        }
        else 
        {
            alert(`${( this.props.AuthorizeSuccess?"": "Thêm " ) + this.state.form.title} thất bại! Vui lòng thử lại`); 
        }
    } 
    Reset = () => this.ReloadUserInput()
}

class Edit extends AddEditComponent
{
    constructor(props)
    {
        super(props); 
        this.state = {...this.state, edit_data: this.PopulateDataIntoFields()}; 
        this.ModifyForm(); 
    }
    FormSubmitValid = (data) => 
    {
        let controller = this.CurrentController(); 
        var url = `../server/controller/database/edit.php?table=${controller}&id=${this.ObjectId()}`; 
        var result = SubmitData("edit",url,data); 
        
        if(Number(result))
        {
            alert("Chỉnh xửa thông tin thành công"); 
            if(controller=="buildings")
            {
                this.BuildingData(); 
            }
            this.Reset(); 
        }
        else
        {
            alert("Chỉnh xửa thông tin thất bại."); 
        }
    }
    ModifyForm = () => 
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
    }
    PopulateDataIntoFields = () => 
    {
        let data = this.TableData(this.CurrentController(), {id: this.ObjectId(), edit: 1}); 
        var edit_data = {}; 
        for (const key in data[0]) 
        {
            edit_data[key.toLowerCase()] = data[0][key]; 
        }
        return edit_data; 
    }
    Reset = () => this.ReloadUserInput(()=>this.setState({edit_data: this.PopulateDataIntoFields()}))
}