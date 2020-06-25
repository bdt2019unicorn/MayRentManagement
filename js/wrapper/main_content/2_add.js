var row_group = Vue.component
(
    "row-group", 
    {
        props: ["row","just_started_parent"], 
        template: 
        `
            <div>
                <br>
                <div class="row">
                    <component 
                        v-for="col in row"
                        :is="col.component"
                        v-bind="col"
                        :just_started_parent="just_started_parent"
                    >
                    </component>

                </div>
            </div>
        `    
    }
);

var add_component = Vue.component
(
    "Add", 
    {
        props: ["controller"], 
        data()
        {
            return {
                title: "Add ",
                just_started_parent: false,  
                form: [], 
                validate: {}
            }
        }, 
        methods: 
        {

            FormValid()
            {
                return (
                    $(this.$refs["action_form"]).valid() && 
                    window.store_track.state.validation.date_required && 
                    window.store_track.state.validation.date_group_valid
                ); 
            }, 
            SubmitForm(event)
            {
                this.just_started_parent = true; 
                if(!this.FormValid())
                {
                    return; 
                }
                let data = $(event.target).serializeObject(); 
                let result = ImportData([data], this.controller); 
                if(result==true)
                {
                    alert(this.title+" Success!"); 
                    if(this.controller!=undefined)
                    {
                        this.$emit("valid-controller-success", this.controller, data); 
                        return; 
                    }
                    window.location.reload(); 
                }
                else
                {
                    alert(this.title+" Fails, please try again!"); 
                }
            }
        },

        mounted()
        {
            $(this.$refs["action_form"]).validate(this.validate); 
        }, 

        created() 
        {
            var data = GetFormDataFields(this.controller);
            try 
            {
                this.form = data.form; 
                this.title = (this.controller!=undefined)?data.title: this.title+data.title; 
                this.validate = (data.validate!=undefined)?data.validate:this.validate; 
            } 
            catch
            {
                this.form = []; 
                this.title ="Add "; 
            }

        },

        template: 
        `
            <form 
                class="container-fluid"
                @submit.prevent="SubmitForm"
                ref="action_form"
            >
                <h1 style="text-align: center;">{{title}}</h1>
                <row-group
                    v-for="row in form"
                    :row="row"
                    :just_started_parent= "just_started_parent"
                >
                </row-group>
            
                <div>
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
                </div>

            </form>
        `
    }
); 