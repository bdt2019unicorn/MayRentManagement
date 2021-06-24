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
    // mixins: [document_mixin], 
    constructor(props)
    {
        super(props); 
        this.state = {edit_data: undefined}; 
    // created() 
    // {
    //     this.edit_data = this.EditData(); 
    // },
    }
    EditData = () => 
    {
        let params = {command: "DocumentEditInformation", id: this.$route.query.id}; 
        var url = this.ServerUrl(params); 
        var result = this.AjaxRequest(url); 
        var edit_data = JSON.parse(result); 
        var url = "server/controller/document/download.php"; 
        var file = this.BlobRequest(url, params); 
        return {...edit_data, file: new File([file], edit_data.Name)}; 
    } 
    Reset = () => 
    {
        this.ResetStateValue({value_name: "edit_data", new_value: this.EditData()}); 
    } 
    Submit = (form_data) => 
    {
        this.SubmitDocumentData
        (
            {
                url: this.ServerUrl({command: "DocumentEditSubmit", id: this.$route.query.id}, "post"), 
                form_data, 
                success_alert: "Chỉnh sửa tài liệu thành công", 
                reset_function: this.Reset
            }
        ); 
    }
    render()
    {
        return (
            <div>edit document</div>
        ); 
/*
    `
        <user-input-document 
            v-if="edit_data" 
            :edit_data="edit_data"
            :select_data_bind="select_data_bind" 
            :in_progress="in_progress"
            text="Add Edited Document" 
            @document-form-data-valid="Submit"
            @user-input-document-reset="Reset"
        >
            <h1>Edit Documents</h1>
            <b>ID: {{edit_data.ID}}</b>
        </user-input-document>
    `
*/
    }
}