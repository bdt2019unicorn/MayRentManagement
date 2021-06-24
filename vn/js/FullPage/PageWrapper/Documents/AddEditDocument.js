class AddDocument extends Document   
{
    Reset = () => this.ResetStateValue({value_name: "select_data_bind", new_value: _.cloneDeep(this.state.select_data_bind)}) 
    Submit = (form_data) => this.SubmitDocumentData
    (
        {
            url: this.ServerUrl({command: "AddDocument"}, "post"), 
            form_data, 
            success_alert: "Đã thêm tài liệu thành công", 
            reset_function: this.Reset
        }
    )
    render() 
    {
        return this.state.select_data_bind ? 
        (
            <UserInputDocument 
                select_data_bind={this.state.select_data_bind}
                in_progress={this.state.in_progress}
                text="Thêm tài liệu mới" 
                DocumentFormDataValid={this.Submit}
                UserInputDocumentReset={this.Reset}
            >
                <h1>Thêm tài liệu</h1>
            </UserInputDocument>
        ): null; 
    }
}

class EditDocument extends Document  
{
    constructor(props)
    {
        super(props); 
        this.state = {...this.state, edit_data: this.EditData()}; 
    }
    EditData = () => 
    {
        let params = {command: "DocumentEditInformation", id: this.ObjectId()}; 
        var url = this.ServerUrl(params); 
        var edit_data = ServerJson(url); 
        url = "../server/controller/document/download.php"; 
        var file = BlobRequest(url, params); 
        edit_data.file = new File([file], edit_data.Name); 
        return _.transform(edit_data, (result, value, key)=>result[key.toLowerCase()]=value); 
    } 
    Reset = () => this.ResetStateValue({value_name: "edit_data", new_value: this.EditData()})
    Submit = (form_data) => this.SubmitDocumentData
    (
        {
            url: this.ServerUrl({command: "DocumentEditSubmit", id: this.ObjectId()}, "post"), 
            form_data, 
            success_alert: "Chỉnh sửa tài liệu thành công", 
            reset_function: this.Reset
        }
    )
    render()
    {
        return this.state.edit_data ? 
        (
            <UserInputDocument 
                edit_data={this.state.edit_data}
                select_data_bind={this.state.select_data_bind}
                in_progress={this.state.in_progress}
                text="Chỉnh sửa tài liệu" 
                DocumentFormDataValid={this.Submit}
                UserInputDocumentReset={this.Reset}
            >
                <h1>Chỉnh sửa tài liệu</h1>
                <b>Mã tài liệu: {this.state.edit_data.ID}</b>
            </UserInputDocument>
        ): null; 
    }
}