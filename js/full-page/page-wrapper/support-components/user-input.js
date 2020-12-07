Vue.component
(
    "user-input", 
    {
        props: ["edit_data", "form", "title", "validate"], 
        mixins: [support_mixin], 
        data: ()=>
        (
            {
                just_started_parent: false,  
                row_valid: {}
            }
        ), 
        methods: 
        {    
            FormValid: ()=> $(this.$refs["action_form"]).valid() && this.ValidObject(this.row_valid), 
            PopulateFormValidation()
            {
                $(this.$refs["action_form"]).trigger("reset"); 
                $(this.$refs["action_form"]).validate().destroy(); 
                $(this.$refs["action_form"]).validate(this.validate); 
            }, 
            RowGroupValidation: (index, validation)=> this.row_valid[index] = validation, 
            SubmitForm(event)
            {
                this.just_started_parent = true; 
                if(!this.FormValid())
                {
                    return; 
                }
                let data = $(event.target).serializeObject(); 
                this.$emit("form-information-valid", data); 
            }
        },
        mounted: ()=> this.PopulateFormValidation(), 
        watch: 
        {
            title: (new_value, old_value)=> this.PopulateFormValidation()
        }, 
        template: 
        `
            <form class="container-fluid" @submit.prevent="SubmitForm" ref="action_form">
                <h1 style="text-align: center;">{{title}}</h1>
                <div v-if="edit_data" class="row">
                    <div class="col">
                        <p><b>ID: </b><span>{{edit_data.id}}</span></p>
                    </div>
                </div>
                <template v-for="(row, index) in form">
                    <br>
                    <row-group
                        :row="row"
                        :just_started_parent= "just_started_parent"
                        :index="index"
                        :key="index"
                        :edit_data="edit_data"
                        @row-group-validation="RowGroupValidation"
                    >
                    </row-group>
                </template>
            
                <br>
                <div class="row">
                    <div class="form-group col-2"><submit-button icon="times" title="Clear" type="reset"></submit-button></div>
                    <div class="form-group col-8"></div>
                    <div class="form-group col-2"><submit-button type="submit" :title="title"></submit-button></div>
                </div>

            </form>
        `
    }
); 
