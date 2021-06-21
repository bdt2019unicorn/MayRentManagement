class UserInputDocument extends BaseComponent 
{
    // props: ["edit_data", "in_progress", "select_data_bind"], 
    constructor(props)
    { 
        super(props); 
        this.state = 
        {
            description: undefined, 
            document_type_id: undefined, 
            file: undefined,
            name: undefined, 
            unit_id: undefined, 
            ...this.EditDataClone()
        }; 
    }
    CallbackReset = () => 
    {
        alert("File uploaded!"); 
        Object.keys(this.$data).forEach(key=>this[key]=undefined); 
    }
    EditDataClone = () => this.props.edit_data ? Object.keys(this.state).reduce
    (
        (accumulator, current_value) => 
        (
            {
                ...accumulator, 
                [current_value]: this.props.edit_data[current_value.toLocaleLowerCase()]
            }, {}
        )
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
            let name = prompt("Enter new file name or cancel to keep current file name", file_name); 
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
        var reset_name = confirm("Would you like to reset the document name?"); 
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
            href: this.state.file.data,
            download: this.state.file.file.name
        }; 
    }
    ValidData = () => 
    {
        var all_keys = Object.keys(this.$data).filter(key=>key!="description"); 
        var validation = all_keys.map(key=>Boolean(this.$data[key])); 
        if(!this.ValidObject(validation))
        {
            return false; 
        }
        var form_data = new FormData(); 
        all_keys.forEach(key=>form_data.append(key, this[key])); 
        form_data.append("description", this.description||""); 
        form_data.append("file_extension", this.file.name.split(".").pop()); 
        this.SubmitUserInformation(form_data); 
        return form_data; 
    } 
    render()
    {
        var { children, in_progress, select_data_bind } = this.props; 
        var file_link_bind = this.FileLinkBind(); 
        var document_edit_data = this.EditDataClone(); 
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
                        <ActionButton class="float-left" icon="clear" />
                        <SubmitButton type="button" />
                    </div>
                </div>
    
                {
                    Boolean(in_progress) && 
                    (
                        null
                        // <div class="popup-div">
                        //     <div class="inner-div text-center border border-danger">
                        //         <h1>Documents is being processed</h1>
                        //         <div>{{in_progress}}%</div>
                        //         <vs-progress class="container-fluid mb-2" :height="12" :percent="in_progress" color="success"></vs-progress>
                        //     </div>
                        // </div>
                    )
                }
                
            </React.Fragment>
        ); 
    }
}