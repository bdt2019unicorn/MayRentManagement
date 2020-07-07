Vue.component
(
    "user-input", 
    {
        props: ["edit_data", "form", "title", "validate"], 
        mixins: [support_mixin], 
        data()
        {
            return {
                just_started_parent: false,  
                row_valid: {}
            }
        }, 
        methods: 
        {        
            PopulateFormValidation()
            {
                $(this.$refs["action_form"]).trigger("reset"); 
                $(this.$refs["action_form"]).validate().destroy(); 
                $(this.$refs["action_form"]).validate(this.validate); 
            }, 
            FormValid()
            {
                return (
                    $(this.$refs["action_form"]).valid() && 
                    this.ValidObject(this.row_valid)
                ); 
            }, 
            RowGroupValidation(index, validation)
            {
                this.row_valid[index] = validation; 
            }, 
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

        watch: 
        {
            title: function(new_value, old_value)
            {
                this.PopulateFormValidation(); 
            }   
        },

        mounted()
        {
            this.PopulateFormValidation(); 
        }, 

        template: 
        `
            <form 
                class="container-fluid"
                @submit.prevent="SubmitForm"
                ref="action_form"
            >
                <h1 style="text-align: center;">{{title}}</h1>
                <template v-for="(row, index) in form">
                    <br>
                    <row-group
                        :row="row"
                        :just_started_parent= "just_started_parent"
                        :controller="StateObject('controller')"
                        :index="index"
                        :key="index"
                        :edit_data="edit_data"
                        @row-group-validation="RowGroupValidation"
                    >
                    </row-group>
                </template>
            
                <br>
                <div class="row">
                    <div class="form-group col-2">
                        <button type="reset" class="btn" title="Clear">
                            <i style="font-size: xx-large;" class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="form-group col-8">
                    </div>
                    <div class="form-group col-2">
                        <button type="submit" class="btn" :title="title">
                            <i style="font-size: xx-large;" class="fas fa-arrow-alt-circle-right"></i>
                        </button>
                    </div>
                </div>

            </form>
        `
    }
); 
