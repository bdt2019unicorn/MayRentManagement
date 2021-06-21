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
            unit_id: undefined 
        }; 
    }

    // created() 
    // {
    //     if(this.edit_data)
    //     {
    //         this.EditDataClone(this); 
    //     }    
    // },
    // mixins: [support_mixin], 
    CallbackReset = () => 
    {
        alert("File uploaded!"); 
        Object.keys(this.$data).forEach(key=>this[key]=undefined); 
    }
    EditData = () => 
    {
        if(this.edit_data)
        {
            var edit_data = {}; 
            this.EditDataClone(edit_data); 
            return edit_data; 
        }
        return undefined; 
    }
    EditDataClone = (object) => 
    {
        Object.keys(this.edit_data).filter(key=>Object.keys(this.$data).includes(key.toLocaleLowerCase())).forEach(key=> object[key.toLocaleLowerCase()]=this.edit_data[key]); 
    }
    FileChanged = (path, files) => 
    {
        var file = files.find(file=>!file.remove); 
        this.file = file; 
        if(!this.name || !this.name.trim())
        {
            this.name = file.name; 
        }
        else 
        {
            let name = prompt("Enter new file name or cancel to keep current file name", file.name); 
            if(name)
            {
                this.name = name; 
            }
        }
    }
    FileDeleted = () => 
    {
        this.file = undefined; 
        var reset_name = confirm("Would you like to reset the document name?"); 
        if(reset_name)
        {
            this.name = undefined; 
        }
    }
    FileLinkBind = () => 
    {
        if(!this.file)
        {
            return undefined; 
        }
        return {
            href: URL.createObjectURL(this.file), 
            download: this.file.name
        }
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
        var { children, edit_data, in_progress, select_data_bind } = this.props; 
        return (
            <React.Fragment>
                <div>
                    {children}

                    {/* <DropzoneAreaBase
  onAdd={(fileObjs) => console.log('Added Files:', fileObjs)}
  onDelete={(fileObj) => console.log('Removed File:', fileObj)}
  onAlert={(message, variant) => console.log(`${variant}: ${message}`)}
/> */}

                    <DropzoneAreaBase
                        onAdd={(file_objects) => this.setState({file: file_objects[0]})}
                        onDelete={(file) => this.setState({file: undefined})} 
                        fileObjects={this.state.file?[this.state.file]: undefined}
                        showAlerts={false}
                        filesLimit={1}
                        maxFileSize={15*(10**6)}
                        showFileNames
                        dropzoneText="Đưa tập tin vào đây"
                    />
                    {/* <DropzoneComponent 
                        config=
                        {
                            {
                                postUrl: "no-url"
                            }
                        }
                        djsConfig=
                        {
                            {
                                autoProcessQueue: false, 
                                addRemoveLinks: true, 
                                dictDefaultMessage: ":test", 
                                maxFiles: 1 
                            }
                        }
                    /> */}


                    {/* <div class="row">
                        <vs-upload 
                            limit="1" 
                            :show-upload-button="false" 
                            :text="$attrs['text']||''" 
                            @change="FileChanged" 
                            @on-delete="FileDeleted" 
                        />
                    </div> */}
                    {/* <p v-if="FileLinkBind"><a v-bind="FileLinkBind">{{FileLinkBind.download}}</a></p> */}
                    {/* <br> */}
                    {/* <div class="row"><text-input title="Document Name" name="name" v-model="name" :edit_data="EditData"></text-input></div> */}
                    {/* <div class="row"><select-input v-bind="select_data_bind.document_type_id" name="document_type_id" v-model="document_type_id" :edit_data="EditData"></select-input></div> */}
                    {/* <div class="row"><select-input v-bind="select_data_bind.unit_id" name="unit_id" v-model="unit_id" :edit_data="EditData"></select-input></div> */}
                    {/* <div class="row"><textarea-input title="Description" name="description" v-model="description" :edit_data="EditData"></textarea-input></div> */}
                    {/* <div class="row d-flex bd-highlight"> */}
                        {/* <submit-button class="mr-auto bd-highlight" icon="times" title="Reset" @submit-button-clicked="$emit('user-input-document-reset')"></submit-button> */}
                        {/* <submit-button v-if="ValidData" class="ml-auto bd-highlight" title="Submit" @submit-button-clicked="$emit('document-form-data-valid', ValidData)"></submit-button> */}
                    {/* </div> */}
                </div>
    
                {/* <div v-if="in_progress" class="popup-div">
                    <div class="inner-div text-center border border-danger">
                        <h1>Documents is being processed</h1>
                        <div>{{in_progress}}%</div>
                        <vs-progress class="container-fluid mb-2" :height="12" :percent="in_progress" color="success"></vs-progress>
                    </div>
                </div> */}
                
            </React.Fragment>
        ); 
    }
}