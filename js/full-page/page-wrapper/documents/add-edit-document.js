Vue.component
(
    "add-document", 
    {
        mixins: [document_mixin], 
        methods: 
        {
            Reset()
            {
                this.ResetValue({value_name: "select_data_bind", new_value: R.clone(this.select_data_bind)}); 
            }, 
            Submit(form_data)
            {
                let url = this.ServerUrl({command: "AddDocument"}); 
                var result = this.AjaxRequest(url, form_data, "POST"); 
                if(Number(result))
                {
                    alert("Document is added!"); 
                    this.Reset(); 
                }
                else
                {
                    alert("There seems to be a server error, please try again"); 
                }
            }
        },
        template: 
        `
            <user-input-document 
                v-if="select_data_bind" 
                :select_data_bind="select_data_bind" 
                text="Add New Document" 
                @document-form-data-valid="Submit"
                @user-input-document-reset="Reset"
            >
                <h1>Add Documents</h1>
            </user-input-document>
        `
    }
); 

Vue.component
(
    "edit-document", 
    {
        mixins: [document_mixin], 
        data: ()=>({edit_data: undefined}),
        created() 
        {
            this.edit_data = this.EditData(); 
        },
        methods: 
        {
            EditData()
            {
                var params = {command: "DocumentEditInformation", id: this.$route.query.id}; 
                var url = this.ServerUrl(params); 
                var result = this.AjaxRequest(url); 
                var edit_data = JSON.parse(result); 
                var url = "server/document_controller/download.php"; 
                var file = this.BlobRequest(url, params); 
                return {...edit_data, file: new File([file], edit_data.Name)}; 
            }, 
            Reset()
            {
                this.ResetValue({value_name: "edit_data", new_value: this.EditData()}); 
            }, 
            Submit(form_data)
            {
                let url = this.ServerUrl({command: "DocumentEditSubmit", id: this.$route.query.id}); 
                var result = this.AjaxRequest(url, form_data, "POST"); 
                if(Number(result))
                {
                    alert("Document edited success!"); 
                    this.ResetValue({value_name: "edit_data", new_value: this.EditData()}); 
                }
                else
                {
                    alert("There seems to be a server error, please try again"); 
                }
            }
        },
        template: 
        `
            <user-input-document 
                v-if="edit_data" 
                :edit_data="edit_data"
                :select_data_bind="select_data_bind" 
                text="Add Edited Document" 
                @document-form-data-valid="Submit"
                @user-input-document-reset="Reset"
            >
                <h1>Edit Documents</h1>
                <b>ID: {{edit_data.ID}}</b>
            </user-input-document>
        `
    }
); 