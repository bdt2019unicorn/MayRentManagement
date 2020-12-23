Vue.component
(
    "add-document", 
    {
        data: ()=> 
        (
            {
                description: undefined, 
                document_type_id: undefined, 
                file: undefined,
                name: undefined, 
                select_data_bind: 
                {
                    document_type_id: {},
                    unit_id: {}
                }, 
                unit_id: undefined 
            }
        ),
        mixins: [support_mixin], 
        computed: 
        {
            ValidData()
            {
                var filter_out = ["description", "select_data_bind"]; 
                var all_keys = Object.keys(this.$data).filter(key=>!filter_out.includes(key)); 
                var validation = all_keys.map(key=>Boolean(this.$data[key])); 
                if(!this.ValidObject(validation))
                {
                    return false; 
                }
                var form_data = new FormData(); 
                all_keys.forEach(key=>form_data.append(key, this[key])); 
                form_data.append("description", this.description); 
                this.SubmitUserInformation(form_data); 
                return form_data; 
            }
        }, 
        created() 
        {
            let select_data_bind = this.AjaxRequest(this.ServerUrl({command: "SelectDataBind"})); 
            this.select_data_bind = JSON.parse(select_data_bind); 
        },
        methods: 
        {
            FileChanged(path, files)
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
            }, 
            FileDeleted()
            {
                this.file = undefined; 
                var reset_name = confirm("Would you like to reset the document name?"); 
                if(reset_name)
                {
                    this.name = undefined; 
                }
            }, 
            ServerUrl(params)
            {
                return `server/document_controller/action.php?building_id=${this.$route.params.building_id}&${this.SearchQueryString(params)}`; 
            }
        },
        template: 
        `
            <div class="container-fluid">
                <h1>Add Documents</h1>
                <div class="row">
                    <vs-upload 
                        limit="1" 
                        :show-upload-button="false" 
                        text="Upload the restore File" 
                        @change="FileChanged" 
                        @on-delete="FileDeleted" 
                    />
                </div>
                <br>
                <div class="row"><text-input title="Document Name" v-model="name"></text-input></div>
                <div class="row"><select-input v-bind="select_data_bind.document_type_id" v-model="document_type_id"></select-input></div>
                <div class="row"><select-input v-bind="select_data_bind.unit_id" v-model="unit_id"></select-input></div>
                <div class="row"><textarea-input title="Description" v-model="description"></textarea-input></div>
                <div v-if="ValidData" class="row justify-content-end"><submit-button></submit-button></div>
            </div>
        `
    }
); 