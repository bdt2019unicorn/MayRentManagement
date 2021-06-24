class UserInputDocument extends BaseComponent 
{
    constructor(props)
    {
        super(props); 
        this.state = 
        {
            description: undefined, 
            document_type_id: undefined, 
            file: undefined,
            name: undefined, 
            unit_id: undefined 
        }; 
        this.state = {...this.state, ...this.EditDataClone()};
        if(this.state.file)
        {
            this.state.file = {file: this.state.file}; 
        }
    }
    EditDataClone = () => this.props.edit_data ? Object.keys(this.state).reduce
    (
        (accumulator, current_value) => 
        (
            {
                ...accumulator, 
                [current_value]: this.props.edit_data[current_value]
            }
        ), {}
    ): undefined
    FileChanged = (files) => 
    {
        var state = {file: files[0], name: (this.state.name || "").trim()}; 
        let file_name = state.file.file.name;
        if(!state.name)
        {
            state.name = file_name; 
        }
        else 
        {
            let name = prompt("Nhập tên tập tin hoặc hủy để giữ tên cũ", file_name); 
            if(name)
            {
                state.name = name; 
            }
        }
        this.setState(state); 
    }
    FileDeleted = (file) => 
    {
        var state = {file: undefined}; 
        var reset_name = confirm("Bạn có muốn nhập tên tập tin mới"); 
        if(reset_name)
        {
            state.name = undefined; 
        }
        this.setState(state); 
    }
    FileLinkBind = () => 
    {
        if(!this.state.file)
        {
            return undefined; 
        }
        return {
            href: _.get(this.state.file, "data") || URL.createObjectURL(this.state.file.file),
            download: _.get(this.state.file, "file.name") 
        }; 
    }
    ValidData = () => 
    {
        var all_keys = Object.keys(this.state).filter(key=>key!="description"); 
        var validation = all_keys.map(key=>Boolean(this.state[key])); 
        if(!ValidObject(validation))
        {
            return false; 
        }
        var form_data = new FormData(); 
        all_keys.forEach(key=>form_data.append(key, this.state[key])); 
        form_data.append("description", this.state.description||""); 
        form_data.append("file_extension", this.state.file.file.name.split(".").pop()); 
        form_data.set("file", this.state.file.file); 
        UserInformation.Submit(form_data); 
        return form_data; 
    } 
    render()
    {
        var { children, in_progress, select_data_bind, DocumentFormDataValid, UserInputDocumentReset } = this.props; 
        var { LinearProgress, Modal } = MaterialUI; 
        var file_link_bind = this.FileLinkBind(); 
        var document_edit_data = this.EditDataClone(); 
        var valid_data = this.ValidData(); 
        return (
            <React.Fragment>
                <div>
                    {children}
                    <br />
                    <DropzoneAreaBase
                        onAdd={this.FileChanged}
                        onDelete={this.FileDeleted} 
                        fileObjects={this.state.file?[this.state.file]: undefined}
                        showAlerts={false}
                        filesLimit={1}
                        maxFileSize={15*(10**6)}
                        showFileNames
                        dropzoneText="Đưa tập tin vào đây"
                    />
                    { Boolean(file_link_bind) && <p><a {...file_link_bind}>{file_link_bind.download}</a></p> }
                    <br />
                    <TextInput title="Tên tài liệu" name="name" value={this.state.name} ValueChange={({value})=>this.setState({name: value})} edit_data={document_edit_data} />
                    <SelectInput {...select_data_bind.document_type_id} title="Loại tài liệu" name="document_type_id" value={this.state.document_type_id} ValueChange={({value})=>this.setState({document_type_id: value})} edit_data={document_edit_data} />
                    <SelectInput {...select_data_bind.unit_id} title="Đơn vị" name="unit_id" value={this.state.unit_id} ValueChange={({value})=>this.setState({unit_id: value})} edit_data={document_edit_data} />
                    <TextareaInput title="Mô tả" name="description" value={this.state.description} ValueChange={({value})=>this.setState({description: value})} edit_data={document_edit_data} />
                    <div>
                        <ActionButton class="float-left" icon="clear" ActionButtonClick={UserInputDocumentReset} />
                        { Boolean(valid_data) && <SubmitButton type="button" SubmitButtonClick={()=>DocumentFormDataValid(valid_data)} /> }
                    </div>
                </div>

                <Modal disableEnforceFocus open={Boolean(in_progress)}>
                    <div className="popup-div">
                        <div className="inner-div text-center border border-red">
                            <h1>Tài liệu đang được tải lên</h1>
                            <div>{in_progress}%</div>
                            <LinearProgress value={in_progress} variant="determinate" />
                        </div>
                    </div>
                </Modal>
            </React.Fragment>
        ); 
    }
}